import { useEffect, useState } from 'react'
import { FullPageChat } from 'flowise-embed-react'
import { useNavigate } from 'react-router-dom'
import LoginDialog from '@/ui-component/dialog/LoginDialog'
import chatflowsApi from '@/api/chatflows'
import useApi from '@/hooks/useApi'
import { baseURL } from '@/store/constant'
import { withAuthenticationRequired } from '@auth0/auth0-react'

import './index.css'

// const CustomPoweredByText = ({ poweredByTextColor }) => (
//     <span>
//         Powered by{' '}
//         <a
//             href={'https://fusionflow.maslow.ai'}
//             target='_blank'
//             rel='noopener noreferrer'
//             className='lite-badge'
//             id='lite-badge'
//             style={{ fontWeight: 'bold', color: poweredByTextColor ?? defaultTextColor }}
//         >
//             Fusion Flow
//         </a>
//     </span>
// )

const ChatbotFull = () => {
    const URLpath = document.location.pathname.toString().split('/')
    const chatflowId = URLpath[URLpath.length - 1] === 'chatbot' ? '' : URLpath[URLpath.length - 1]
    const navigate = useNavigate()

    const [chatflow, setChatflow] = useState(null)
    const [chatbotTheme, setChatbotTheme] = useState({})
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [loginDialogProps, setLoginDialogProps] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [chatbotOverrideConfig, setChatbotOverrideConfig] = useState({})

    const getSpecificChatflowFromPublicApi = useApi(chatflowsApi.getSpecificChatflowFromPublicEndpoint)
    const getSpecificChatflowApi = useApi(chatflowsApi.getSpecificChatflow)

    const onLoginClick = (username, password) => {
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        navigate(0)
    }

    useEffect(() => {
        getSpecificChatflowFromPublicApi.request(chatflowId)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getSpecificChatflowFromPublicApi.error) {
            if (getSpecificChatflowFromPublicApi.error?.response?.status === 401) {
                if (localStorage.getItem('username') && localStorage.getItem('password')) {
                    getSpecificChatflowApi.request(chatflowId)
                } else {
                    setLoginDialogProps({
                        title: 'Login',
                        confirmButtonName: 'Login'
                    })
                    setLoginDialogOpen(true)
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificChatflowFromPublicApi.error])

    useEffect(() => {
        if (getSpecificChatflowApi.error) {
            if (getSpecificChatflowApi.error?.response?.status === 401) {
                setLoginDialogProps({
                    title: 'Login',
                    confirmButtonName: 'Login'
                })
                setLoginDialogOpen(true)
            }
        }
    }, [getSpecificChatflowApi.error])

    useEffect(() => {
        if (getSpecificChatflowFromPublicApi.data || getSpecificChatflowApi.data) {
            const chatflowData = getSpecificChatflowFromPublicApi.data || getSpecificChatflowApi.data
            setChatflow(chatflowData)
            if (chatflowData.chatbotConfig) {
                try {
                    const parsedConfig = JSON.parse(chatflowData.chatbotConfig)
                    setChatbotTheme(parsedConfig)
                    if (parsedConfig.overrideConfig) {
                        // Generate new sessionId
                        if (parsedConfig.overrideConfig.generateNewSession) {
                            parsedConfig.overrideConfig.sessionId = Date.now().toString()
                        }
                        setChatbotOverrideConfig(parsedConfig.overrideConfig)
                    }
                } catch (e) {
                    console.error(e)
                    setChatbotTheme({})
                    setChatbotOverrideConfig({})
                }
            }
        }
    }, [getSpecificChatflowFromPublicApi.data, getSpecificChatflowApi.data])

    useEffect(() => {
        setLoading(getSpecificChatflowFromPublicApi.loading || getSpecificChatflowApi.loading)
    }, [getSpecificChatflowFromPublicApi.loading, getSpecificChatflowApi.loading])

    return (
        <>
            {!isLoading ? (
                <>
                    {!chatflow || chatflow.apikeyid ? (
                        <p>Invalid Chatbot</p>
                    ) : (
                        <FullPageChat
                            chatflowid={chatflow.id}
                            apiHost={baseURL}
                            chatflowConfig={chatbotOverrideConfig}
                            theme={{
                                chatWindow: {
                                    ...chatbotTheme.chatWindow,
                                    // poweredByText: 'Your Custom Powered By Text', // Enter your custom text here
                                    // poweredByText: <CustomPoweredByText poweredByTextColor="#303235" />,
                                    href: 'none',
                                    poweredByTextColor: 'transparent'
                                    // fontSize: '0'
                                    // poweredByTextColor: 'black'
                                },
                                userMessage: {
                                    ...chatbotTheme.userMessage,
                                    background: 'linear-gradient(to bottom right, #e084b4 0%, #77bfaf 100%)'
                                }
                            }}
                        />
                    )}
                    <LoginDialog show={loginDialogOpen} dialogProps={loginDialogProps} onConfirm={onLoginClick} />
                </>
            ) : null}
        </>
    )
}

export default withAuthenticationRequired(ChatbotFull)
