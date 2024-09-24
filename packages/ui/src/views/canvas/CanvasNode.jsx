import PropTypes from 'prop-types'
import { useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { IconButton, Box, Typography, Divider, Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

// project imports
import NodeCardWrapper from '@/ui-component/cards/NodeCardWrapper'
import NodeTooltip from '@/ui-component/tooltip/NodeTooltip'
import NodeInputHandler from './NodeInputHandler'
import NodeOutputHandler from './NodeOutputHandler'
import AdditionalParamsDialog from '@/ui-component/dialog/AdditionalParamsDialog'
import NodeInfoDialog from '@/ui-component/dialog/NodeInfoDialog'

// const
import { baseURL } from '@/store/constant'
import { IconTrash, IconCopy, IconInfoCircle, IconAlertTriangle } from '@tabler/icons-react'
import { flowContext } from '@/store/context/ReactFlowContext'
import LlamaindexPNG from '@/assets/images/llamaindex.png'

// ===========================|| CANVAS NODE ||=========================== //

const CanvasNode = ({ data }) => {
    const theme = useTheme()
    const canvas = useSelector((state) => state.canvas)
    const { deleteNode, duplicateNode } = useContext(flowContext)

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [showInfoDialog, setShowInfoDialog] = useState(false)
    const [infoDialogProps, setInfoDialogProps] = useState({})
    const [warningMessage, setWarningMessage] = useState('')
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const nodeOutdatedMessage = (oldVersion, newVersion) => `Node version ${oldVersion} outdated\nUpdate to latest version ${newVersion}`

    const nodeVersionEmptyMessage = (newVersion) => `Node outdated\nUpdate to latest version ${newVersion}`

    const onDialogClicked = () => {
        const dialogProps = {
            data,
            inputParams: data.inputParams.filter((inputParam) => !inputParam.hidden).filter((param) => param.additionalParams),
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        }
        setDialogProps(dialogProps)
        setShowDialog(true)
    }

    useEffect(() => {
        const componentNode = canvas.componentNodes.find((nd) => nd.name === data.name)
        if (componentNode) {
            if (!data.version) {
                setWarningMessage(nodeVersionEmptyMessage(componentNode.version))
            } else if (data.version && componentNode.version > data.version) {
                setWarningMessage(nodeOutdatedMessage(data.version, componentNode.version))
            } else if (componentNode.badge === 'DEPRECATING') {
                setWarningMessage(
                    componentNode?.deprecateMessage ??
                        'This node will be deprecated in the next release. Change to a new node tagged with NEW'
                )
            } else {
                setWarningMessage('')
            }
        }
    }, [canvas.componentNodes, data.name, data.version])

    return (
        <>
            <NodeCardWrapper
                content={false}
                sx={{
                    padding: 0,
                    borderImage: data.selected
                        ? (() => {
                              switch (data.category) {
                                  case 'Agents':
                                      return 'linear-gradient(to bottom right, #6dc4ad, #6dc4ad )'
                                  case 'Cache':
                                      return 'linear-gradient(to bottom right, #a5a5a5, #a5a5a5 )'
                                  case 'Chains':
                                      return 'linear-gradient(to bottom right, #6dc4ad, #6dc4ad )'
                                  case 'Chat Models':
                                      return 'linear-gradient(to bottom right, #A070A6, #A070A6 )'
                                  case 'Document Loaders':
                                      return 'linear-gradient(to bottom right, #f3a326, #f3a326 )'
                                  case 'Embeddings':
                                      return 'linear-gradient(to bottom right, #401877, #401877 )'
                                  case 'LLMs':
                                      return 'linear-gradient(to bottom right, #A070A6, #A070A6 )'
                                  case 'Memory':
                                      return 'linear-gradient(to bottom right, #333333, #333333 )'
                                  case 'Moderation':
                                      return 'linear-gradient(to bottom right, #d52c2c, #d52c2c )'
                                  case 'Output Parsers':
                                      return 'linear-gradient(to bottom right, #469dbb, #469dbb )'
                                  case 'Prompts':
                                      return 'linear-gradient(to bottom right, #ee7bb3, #ee7bb3 )'
                                  case 'Retrievers':
                                      return 'linear-gradient(to bottom right, #da85b2, #da85b2 )'
                                  case 'Text Splitters':
                                      return 'linear-gradient(to bottom right, #e19379, #e19379 )'
                                  case 'Tools':
                                      return 'linear-gradient(to bottom right, #a070a6, #a070a6 )'
                                  case 'Utilities':
                                      return 'linear-gradient(to bottom right, #469dbb, #469dbb )'
                                  case 'Vector Stores':
                                      return 'linear-gradient(to bottom right, #121d35, #121d35 )'
                                  case 'Engine':
                                      return 'linear-gradient(to bottom right, #6dc4ad, #6dc4ad )'
                                  case 'Response Synthesizer':
                                      return 'linear-gradient(to bottom right, #ee7bb3, #ee7bb3 )'
                                  case 'Record Manager':
                                      return 'linear-gradient(to bottom right, #1098F7, #1098F7 )'
                                  case 'Multi Agents':
                                      return 'linear-gradient(to bottom right, #e084b4 0%, #77bfaf 100% )'
                                  default:
                                      return 'linear-gradient(to bottom right, #e084b4 0%, #77bfaf 100% )'
                              }
                          })()
                        : 'linear-gradient(to bottom right, #e084b4 0%, #77bfaf 100% )',
                    borderWidth: '3px',
                    borderImageSlice: 1,
                    // animation: 'gradientAnimation 5s linear infinite',
                    '&:hover': {
                        boxShadow: data.selected
                            ? (() => {
                                  switch (data.category) {
                                      case 'Agents':
                                          return '0 0 15px rgba(109, 196, 173, 50)'
                                      case 'Cache':
                                          return '0 0 15px rgba(165, 165, 165, 50)'
                                      case 'Chains':
                                          return '0 0 15px rgba(109, 196, 173, 50)'
                                      case 'Chat Models':
                                          return '0 0 15px rgba(160, 112, 166, 50)'
                                      case 'Document Loaders':
                                          return '0 0 15px rgba(243, 163, 38, 50)'
                                      case 'Embeddings':
                                          return '0 0 15px rgba(64, 24, 119, 50)'
                                      case 'LLMs':
                                          return '0 0 15px rgba(160, 112, 166, 50)'
                                      case 'Memory':
                                          return '0 0 15px rgba(51, 51, 51, 50)'
                                      case 'Moderation':
                                          return '0 0 15px rgba(213, 44, 44, 50)'
                                      case 'Output Parsers':
                                          return '0 0 15px rgba(70, 157, 187, 50)'
                                      case 'Prompts':
                                          return '0 0 15px rgba(238, 123, 179, 50)'
                                      case 'Retrievers':
                                          return '0 0 15px rgba(218, 133, 178, 50)'
                                      case 'Text Splitters':
                                          return '0 0 15px rgba(225, 147, 121, 50)'
                                      case 'Tools':
                                          return '0 0 15px rgba(160, 112, 166, 50)'
                                      case 'Utilities':
                                          return '0 0 15px rgba(70, 157, 187, 50)'
                                      case 'Vector Stores':
                                          return '0 0 15px rgba(18, 29, 53, 50)'
                                      case 'Engine':
                                          return '0 0 15px rgba(109, 196, 173, 50)'
                                      case 'Response Synthesizer':
                                          return '0 0 15px rgba(238, 123, 179, 50)'
                                      case 'Record Manager':
                                          return '0 0 15px rgba(16, 152, 247, 50)'
                                      case 'Multi Agents':
                                          return '0 0 10px rgb(224, 132, 180, 20), 0 0 15px rgb(119, 191, 175, 30)'
                                      default:
                                          return '0 0 10px rgb(224, 132, 180, 20), 0 0 15px rgb(119, 191, 175, 30)'
                                  }
                              })()
                            : '0 0 10px rgb(224, 132, 180, 20), 0 0 15px rgb(119, 191, 175, 30)'
                    }
                }}
            >
                <NodeTooltip
                    open={!canvas.canvasDialogShow && open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    disableFocusListener={true}
                    title={
                        <div
                            style={{
                                background: 'transparent',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <IconButton
                                title='Duplicate'
                                onClick={() => {
                                    duplicateNode(data.id)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: theme?.palette.primary.main } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconCopy />
                            </IconButton>
                            <IconButton
                                title='Delete'
                                onClick={() => {
                                    deleteNode(data.id)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: 'red' } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconTrash />
                            </IconButton>
                            <IconButton
                                title='Info'
                                onClick={() => {
                                    setInfoDialogProps({ data })
                                    setShowInfoDialog(true)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: theme?.palette.secondary.main } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconInfoCircle />
                            </IconButton>
                        </div>
                    }
                    placement='right-start'
                >
                    {/* backgroundColor: data.type === 'TextSplitter' ? '#e084b4' : '#fff' */}
                    <Box>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                background: (() => {
                                    switch (data.category) {
                                        case 'Agents':
                                            return '#6dc4ad'
                                        case 'Cache':
                                            return '#a5a5a5'
                                        case 'Chains':
                                            return '#6dc4ad'
                                        case 'Chat Models':
                                            return '#A070A6'
                                        case 'Document Loaders':
                                            return '#f3a326'
                                        case 'Embeddings':
                                            return '#401877'
                                        case 'LLMs':
                                            return '#A070A6'
                                        case 'Memory':
                                            return '#333333'
                                        case 'Moderation':
                                            return '#d52c2c'
                                        case 'Output Parsers':
                                            return '#469dbb'
                                        case 'Prompts':
                                            return '#ee7bb3'
                                        case 'Retrievers':
                                            return '#da85b2'
                                        case 'Text Splitters':
                                            return '#e19379'
                                        case 'Tools':
                                            return '#a070a6'
                                        case 'Utilities':
                                            return '#469dbb'
                                        case 'Vector Stores':
                                            return '#121d35'
                                        case 'Engine':
                                            return '#6dc4ad'
                                        case 'Response Synthesizer':
                                            return '#ee7bb3'
                                        case 'Record Manager':
                                            return '#1098F7'
                                        case 'Multi Agents':
                                            return 'linear-gradient(to bottom right, #e084b4 0%, #77bfaf 100% )'
                                        default:
                                            return 'linear-gradient(to bottom right, #e084b4, #77bfaf )'
                                    }
                                })()
                            }}
                        >
                            <Box style={{ width: 50, marginRight: 10, padding: 5 }}>
                                <div
                                    style={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        // borderRadius: '50%',
                                        // backgroundColor: 'white',
                                        backgroundColor: '#EEEEEE',
                                        cursor: 'grab'
                                    }}
                                >
                                    <img
                                        style={{ width: '100%', height: '100%', padding: 5, objectFit: 'contain' }}
                                        src={`${baseURL}/api/v1/node-icon/${data.name}`}
                                        alt='Notification'
                                    />
                                </div>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        mr: 2,
                                        color:
                                            data.category === 'Agents' ||
                                            data.category === 'Chains' ||
                                            data.category === 'Retrievers' ||
                                            data.category === 'Engine'
                                                ? '#333333'
                                                : '#FFFFFF'
                                    }}
                                >
                                    {data.label}
                                </Typography>
                            </Box>
                            <div style={{ flexGrow: 1 }}></div>
                            {data.tags && data.tags.includes('LlamaIndex') && (
                                <>
                                    <div
                                        style={{
                                            borderRadius: '50%',
                                            padding: 15
                                        }}
                                    >
                                        <img
                                            style={{ width: '25px', height: '25px', borderRadius: '50%', objectFit: 'contain' }}
                                            src={LlamaindexPNG}
                                            alt='LlamaIndex'
                                        />
                                    </div>
                                </>
                            )}
                            {warningMessage && (
                                <>
                                    <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{warningMessage}</span>} placement='top'>
                                        <IconButton sx={{ height: 35, width: 35 }}>
                                            <IconAlertTriangle size={35} color='orange' />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                        {(data.inputAnchors.length > 0 || data.inputParams.length > 0) && (
                            <>
                                <Divider />
                                <Box sx={{ background: theme.palette.asyncSelect.main, p: 1 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            textAlign: 'center'
                                        }}
                                    >
                                        Inputs
                                    </Typography>
                                </Box>
                                <Divider />
                            </>
                        )}
                        {data.inputAnchors.map((inputAnchor, index) => (
                            <NodeInputHandler key={index} inputAnchor={inputAnchor} data={data} />
                        ))}
                        {data.inputParams
                            .filter((inputParam) => !inputParam.hidden)
                            .map((inputParam, index) => (
                                <NodeInputHandler key={index} inputParam={inputParam} data={data} />
                            ))}
                        {data.inputParams.find((param) => param.additionalParams) && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop:
                                        data.inputParams.filter((param) => param.additionalParams).length ===
                                        data.inputParams.length + data.inputAnchors.length
                                            ? 20
                                            : 0
                                }}
                            >
                                {/* <Button disableRipple sx={{ width: '90%', mb: 2 }} onClick={onDialogClicked}> current */}
                                <Button sx={{ borderRadius: 25, width: '90%', mb: 2 }} variant='outlined' onClick={onDialogClicked}>
                                    Additional Parameters
                                </Button>
                            </div>
                        )}
                        <Divider />
                        <Box sx={{ background: theme.palette.asyncSelect.main, p: 1 }}>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    textAlign: 'center'
                                }}
                            >
                                Output
                            </Typography>
                        </Box>
                        <Divider />
                        {data.outputAnchors.map((outputAnchor) => (
                            <NodeOutputHandler key={JSON.stringify(data)} outputAnchor={outputAnchor} data={data} />
                        ))}
                    </Box>
                </NodeTooltip>
            </NodeCardWrapper>
            <AdditionalParamsDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
            ></AdditionalParamsDialog>
            <NodeInfoDialog show={showInfoDialog} dialogProps={infoDialogProps} onCancel={() => setShowInfoDialog(false)}></NodeInfoDialog>
        </>
    )
}

CanvasNode.propTypes = {
    data: PropTypes.object
}

export default CanvasNode
