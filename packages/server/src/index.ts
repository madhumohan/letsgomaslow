import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import path from 'path'
import cors from 'cors'
import http from 'http'
import basicAuth from 'express-basic-auth'
import { Server } from 'socket.io'
import { DataSource } from 'typeorm'
import { IChatFlow, ILabel } from './Interface'
import { getNodeModulesPackagePath, getEncryptionKey } from './utils'
import logger, { expressRequestLogger } from './utils/logger'
import { getDataSource } from './DataSource'
import { NodesPool } from './NodesPool'
import { ChatFlow } from './database/entities/ChatFlow'
import { ChatflowPool } from './ChatflowPool'
import { CachePool } from './CachePool'
import { initializeRateLimiter } from './utils/rateLimit'
import { getAPIKeys } from './utils/apiKey'
import { sanitizeMiddleware, getCorsOptions, getAllowedIframeOrigins } from './utils/XSS'
import { Telemetry } from './utils/telemetry'
import flowiseApiV1Router from './routes'
import errorHandlerMiddleware from './middlewares/errors'
import { cloneDeep } from 'lodash'

declare global {
    namespace Express {
        interface Request {
            io?: Server
        }
    }
}

export class App {
    app: express.Application
    nodesPool: NodesPool
    chatflowPool: ChatflowPool
    cachePool: CachePool
    telemetry: Telemetry
    AppDataSource: DataSource = getDataSource()

    constructor() {
        this.app = express()
    }

    async initDatabase() {
        // Initialize database
        try {
            await this.AppDataSource.initialize()
            logger.info('📦 [server]: Data Source is initializing...')

            // Run Migrations Scripts
            await this.AppDataSource.runMigrations({ transaction: 'each' })

            // Initialize nodes pool
            this.nodesPool = new NodesPool()
            await this.nodesPool.initialize()

            // Initialize chatflow pool
            this.chatflowPool = new ChatflowPool()

            // Initialize API keys
            await getAPIKeys()

            // Initialize encryption key
            await getEncryptionKey()

            // Initialize Rate Limit
            const AllChatFlow: IChatFlow[] = await getAllChatFlow()
            await initializeRateLimiter(AllChatFlow)

            // Initialize cache pool
            this.cachePool = new CachePool()

            // Initialize telemetry
            this.telemetry = new Telemetry()
            logger.info('📦 [server]: Data Source has been initialized!')
        } catch (error) {
            logger.error('❌ [server]: Error during Data Source initialization:', error)
        }
    }

    async config(socketIO?: Server) {
        // Limit is needed to allow sending/receiving base64 encoded string
        const flowise_file_size_limit = process.env.FLOWISE_FILE_SIZE_LIMIT || '50mb'
        this.app.use(express.json({ limit: flowise_file_size_limit }))
        this.app.use(express.urlencoded({ limit: flowise_file_size_limit, extended: true }))
        if (process.env.NUMBER_OF_PROXIES && parseInt(process.env.NUMBER_OF_PROXIES) > 0)
            this.app.set('trust proxy', parseInt(process.env.NUMBER_OF_PROXIES))

        // Allow access from specified domains
        this.app.use(cors(getCorsOptions()))

        // Allow embedding from specified domains.
        this.app.use((req, res, next) => {
            const allowedOrigins = getAllowedIframeOrigins()
            if (allowedOrigins == '*') {
                next()
            } else {
                const csp = `frame-ancestors ${allowedOrigins}`
                res.setHeader('Content-Security-Policy', csp)
                next()
            }
        })

        // Switch off the default 'X-Powered-By: Express' header
        this.app.disable('x-powered-by')

        // Add the expressRequestLogger middleware to log all requests
        this.app.use(expressRequestLogger)

        // Add the sanitizeMiddleware to guard against XSS
        this.app.use(sanitizeMiddleware)

        // Make io accessible to our router on req.io
        this.app.use((req, res, next) => {
            req.io = socketIO
            next()
        })

        if (process.env.FLOWISE_USERNAME && process.env.FLOWISE_PASSWORD) {
            const username = process.env.FLOWISE_USERNAME
            const password = process.env.FLOWISE_PASSWORD
            const basicAuthMiddleware = basicAuth({
                users: { [username]: password }
            })
            const whitelistURLs = [
                '/api/v1/verify/apikey/',
                '/api/v1/chatflows/apikey/',
                '/api/v1/public-chatflows',
                '/api/v1/public-chatbotConfig',
                '/api/v1/prediction/',
                '/api/v1/vector/upsert/',
                '/api/v1/node-icon/',
                '/api/v1/components-credentials-icon/',
                '/api/v1/chatflows-streaming',
                '/api/v1/chatflows-uploads',
                '/api/v1/openai-assistants-file/download',
                '/api/v1/feedback',
                '/api/v1/leads',
                '/api/v1/get-upload-file',
                '/api/v1/ip'
            ]
            this.app.use((req, res, next) => {
                if (req.url.includes('/api/v1/')) {
                    whitelistURLs.some((url) => req.url.includes(url)) ? next() : basicAuthMiddleware(req, res, next)
                } else next()
            })
        }

        this.app.use('/api/v1', flowiseApiV1Router)

        // ----------------------------------------
        // Configure number of proxies in Host Environment
        // ----------------------------------------
        this.app.get('/api/v1/ip', (request, response) => {
            response.send({
                ip: request.ip,
                msg: 'Check returned IP address in the response. If it matches your current IP address ( which you can get by going to http://ip.nfriedly.com/ or https://api.ipify.org/ ), then the number of proxies is correct and the rate limiter should now work correctly. If not, increase the number of proxies by 1 and restart Cloud-Hosted Fusion Flow until the IP address matches your own.'
            })
        })

        // ----------------------------------------
        // Components
        // ----------------------------------------

        // Get all component nodes
        this.app.get('/api/v1/nodes', (req: Request, res: Response) => {
            const returnData = []

            for (const nodeName in this.nodesPool.componentNodes) {
                const clonedNode = cloneDeep(this.nodesPool.componentNodes[nodeName])
                returnData.push(clonedNode)
            }
            return res.json(returnData)
        })

        this.app.get('/api/v1/connected-nodes', (req: Request, res: Response, next: NextFunction) => {
            try {
                //console.log("req.query=>",req.query.allnames);
                const returnData: ILabel[] = []
                const allnames = req.query.allnames as string
                var allNodeNames = allnames.trim().split('|')
                // console.log('allNodeNames=>', allNodeNames)
                for (const nodeName in this.nodesPool.componentNodes) {
                    const clonedNode = cloneDeep(this.nodesPool.componentNodes[nodeName])
                    var nodeInputes = clonedNode.inputs
                    // console.log('nodeInputes=>', nodeInputes)
                    if (nodeInputes) {
                        for (const text of allNodeNames) {
                            let resultNode = nodeInputes.filter((e) => e.type === text)
                            // console.log('resultNode=>', resultNode)
                            // console.log('text=>', text)
                            if (resultNode.length > 0) {
                                const label = clonedNode.label
                                // console.log("label==>",label);
                                const data: ILabel = { label: label }
                                const findData = returnData.find((e) => e.label == data.label)
                                if (findData === undefined) {
                                    returnData.push(data)
                                }
                            }
                        }
                    }
                }
                return res.json(returnData)
            } catch (error) {
                next(error)
            }
        })

        // ----------------------------------------
        // Serve UI static
        // ----------------------------------------

        const packagePath = getNodeModulesPackagePath('flowise-ui')
        const uiBuildPath = path.join(packagePath, 'build')
        const uiHtmlPath = path.join(packagePath, 'build', 'index.html')

        this.app.use('/', express.static(uiBuildPath))

        // All other requests not handled will return React app
        this.app.use((req: Request, res: Response) => {
            res.sendFile(uiHtmlPath)
        })

        // Error handling
        this.app.use(errorHandlerMiddleware)
    }

    async stopApp() {
        try {
            const removePromises: any[] = []
            removePromises.push(this.telemetry.flush())
            await Promise.all(removePromises)
        } catch (e) {
            logger.error(`❌[server]: Fusion Flow Server shut down error: ${e}`)
        }
    }
}

let serverApp: App | undefined

export async function getAllChatFlow(): Promise<IChatFlow[]> {
    return await getDataSource().getRepository(ChatFlow).find()
}

export async function start(): Promise<void> {
    serverApp = new App()

    const port = parseInt(process.env.PORT || '', 10) || 3000
    const server = http.createServer(serverApp.app)

    const io = new Server(server, {
        cors: getCorsOptions()
    })

    await serverApp.initDatabase()
    await serverApp.config(io)

    server.listen(port, () => {
        logger.info(`⚡️ [server]: Fusion Flow Server is listening at ${port}`)
    })
}

export function getInstance(): App | undefined {
    return serverApp
}
