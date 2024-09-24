import PropTypes from 'prop-types'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
import { useEffect, useRef, useState, useContext } from 'react'

// material-ui
import { styled } from '@mui/material/styles'
import { Box, Typography, Tooltip } from '@mui/material'
import { tooltipClasses } from '@mui/material/Tooltip'
import { flowContext } from '@/store/context/ReactFlowContext'
import { isValidConnection } from '@/utils/genericHelper'
import { Dropdown } from '@/ui-component/dropdown/Dropdown'

// const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
//     [`& .${tooltipClasses.tooltip}`]: {
//         maxWidth: 500
//     }
// })

const CustomWidthTooltip = styled(({ className, open, children, ...props }) => (
    <Tooltip {...props} open={open} classes={{ popper: className }}>
        {children}
    </Tooltip>
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500
        // position: 'absolute',
    }
})

// ===========================|| NodeOutputHandler ||=========================== //

const NodeOutputHandler = ({ outputAnchor, data, disabled = false }) => {
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()
    const [position, setPosition] = useState(0)
    const [dropdownValue, setDropdownValue] = useState(null)
    const { reactFlowInstance } = useContext(flowContext)
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [dataLabel, setDataLabel] = useState('')

    useEffect(() => {
        if (ref.current && ref.current?.offsetTop && ref.current?.clientHeight) {
            setTimeout(() => {
                setPosition(ref.current?.offsetTop + ref.current?.clientHeight / 2)
                updateNodeInternals(data.id)
            }, 0)
        }
    }, [data.id, ref, updateNodeInternals])

    useEffect(() => {
        setTimeout(() => {
            updateNodeInternals(data.id)
        }, 0)
    }, [data.id, position, updateNodeInternals])

    useEffect(() => {
        if (dropdownValue) {
            setTimeout(() => {
                updateNodeInternals(data.id)
            }, 0)
        }
    }, [data.id, dropdownValue, updateNodeInternals])

    // const handleClick = () => {
    //     setTooltipOpen(!tooltipOpen);
    //     console.log('Handle Clicked');
    // };

    const handleClick = () => {
        setTooltipOpen(!tooltipOpen)
        // console.log('Handle Clicked for ', outputAnchor.type)

        // Extracting labels of input anchors
        const allnames = outputAnchor.type.split(' ').join('')

        // console.log('Hi: ', allnames)

        // Constructing the URL with the query parameter
        const url = `/api/v1/connected-nodes?allnames=${encodeURIComponent(allnames)}`

        // Call your API using fetch
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                // console.log('data==>', data) // Log or update state with the response data
                const labels = data.map((item) => item.label).join(' | ')
                // Update state with the formatted labels
                setDataLabel(labels)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setTooltipOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div ref={ref}>
            {outputAnchor.type !== 'options' && !outputAnchor.options && (
                <>
                    <CustomWidthTooltip placement='right' title={dataLabel} open={tooltipOpen}>
                        <Handle
                            type='source'
                            position={Position.Right}
                            key={outputAnchor.id}
                            id={outputAnchor.id}
                            onClick={handleClick}
                            isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                            style={{
                                height: 13,
                                width: 13,
                                // backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                backgroundColor: data.selected ? '#4BC3A8' : '#C4C9C8',
                                top: position
                            }}
                        />
                    </CustomWidthTooltip>
                    <Box sx={{ p: 2, textAlign: 'end' }}>
                        <Typography>{outputAnchor.label}</Typography>
                    </Box>
                </>
            )}
            {data.name === 'ifElseFunction' && outputAnchor.type === 'options' && outputAnchor.options && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <CustomWidthTooltip
                            placement='left'
                            title={
                                outputAnchor.options.find((opt) => opt.name === data.outputs?.[outputAnchor.name])?.type ??
                                outputAnchor.type
                            }
                        >
                            <Handle
                                type='source'
                                position={Position.Left}
                                key={outputAnchor.options.find((opt) => opt.name === 'returnTrue')?.id ?? ''}
                                id={outputAnchor.options.find((opt) => opt.name === 'returnTrue')?.id ?? ''}
                                isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                                style={{
                                    // height: 10,
                                    // width: 10,
                                    // backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                    height: 13,
                                    width: 13,
                                    backgroundColor: data.selected ? '#4BC3A8' : '#C4C9C8',
                                    top: position - 25
                                }}
                            />
                        </CustomWidthTooltip>
                        <div style={{ flex: 1 }}></div>
                        <Box sx={{ p: 2, textAlign: 'end' }}>
                            <Typography>True</Typography>
                        </Box>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <CustomWidthTooltip
                            placement='right'
                            title={
                                outputAnchor.options.find((opt) => opt.name === data.outputs?.[outputAnchor.name])?.type ??
                                outputAnchor.type
                            }
                        >
                            <Handle
                                type='source'
                                position={Position.Right}
                                key={outputAnchor.options.find((opt) => opt.name === 'returnFalse')?.id ?? ''}
                                id={outputAnchor.options.find((opt) => opt.name === 'returnFalse')?.id ?? ''}
                                isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                                style={{
                                    // height: 10,
                                    // width: 10,
                                    // backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                    height: 13,
                                    width: 13,
                                    backgroundColor: data.selected ? '#4BC3A8' : '#C4C9C8',
                                    top: position + 25
                                }}
                            />
                        </CustomWidthTooltip>
                        <div style={{ flex: 1 }}></div>
                        <Box sx={{ p: 2, textAlign: 'end' }}>
                            <Typography>False</Typography>
                        </Box>
                    </div>
                </div>
            )}
            {data.name !== 'ifElseFunction' &&
                outputAnchor.type === 'options' &&
                outputAnchor.options &&
                outputAnchor.options.length > 0 && (
                    <>
                        <CustomWidthTooltip
                            placement='right'
                            title={
                                outputAnchor.options.find((opt) => opt.name === data.outputs?.[outputAnchor.name])?.type ??
                                outputAnchor.type
                            }
                        >
                            <Handle
                                type='source'
                                position={Position.Right}
                                id={outputAnchor.options.find((opt) => opt.name === data.outputs?.[outputAnchor.name])?.id ?? ''}
                                isValidConnection={(connection) => isValidConnection(connection, reactFlowInstance)}
                                style={{
                                    // height: 10,
                                    // width: 10,
                                    // backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                    height: 13,
                                    width: 13,
                                    backgroundColor: data.selected ? '#4BC3A8' : '#C4C9C8',
                                    top: position
                                }}
                            />
                        </CustomWidthTooltip>
                        <Box sx={{ p: 2, textAlign: 'end' }}>
                            <Dropdown
                                disabled={disabled}
                                disableClearable={true}
                                name={outputAnchor.name}
                                options={outputAnchor.options}
                                onSelect={(newValue) => {
                                    setDropdownValue(newValue)
                                    data.outputs[outputAnchor.name] = newValue
                                }}
                                value={data.outputs[outputAnchor.name] ?? outputAnchor.default ?? 'choose an option'}
                            />
                        </Box>
                    </>
                )}
        </div>
    )
}

NodeOutputHandler.propTypes = {
    outputAnchor: PropTypes.object,
    data: PropTypes.object,
    disabled: PropTypes.bool
}

export default NodeOutputHandler
