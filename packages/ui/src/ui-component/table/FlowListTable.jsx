import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { styled } from '@mui/material/styles'
import {
    Box,
    Button,
    // Button,
    Chip,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
import FlowListMenu from '../button/FlowListMenu'
import { useNavigate } from 'react-router-dom'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    //     [`&.${tableCellClasses.head}`]: {
    //         backgroundColor: theme.palette.common.black,
    //         color: theme.palette.common.white
    //     },
    //     [`&.${tableCellClasses.body}`]: {
    //         fontSize: 14
    //     }

    borderColor: theme.palette.grey[900] + 25,

    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.grey[900]
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        height: 64
    }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    }
}))

// export const FlowListTable = ({ data, images, isLoading, filterFunction, updateFlowsApi, setError }) => {  current
//     const theme = useTheme()
//     const customization = useSelector((state) => state.customization)
//     const navigate = useNavigate()
//     const goToCanvas = (selectedChatflow) => {
//         navigate(`/canvas/${selectedChatflow.id}`)
//     }
//     return (
//         <>
//             <TableContainer sx={{ border: 1, marginTop: '30' }} component={Paper}>
//                 <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
//                     <TableHead>
//                         <TableRow sx={{ marginTop: '10', backgroundColor: 'primary' }}>
export const FlowListTable = ({ data, images, isLoading, filterFunction, updateFlowsApi, setError, isAgentCanvas }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const navigate = useNavigate()
    // const goToCanvas = (selectedChatflow) => {
    //     navigate(`/canvas/${selectedChatflow.id}`)
    // }

    const goToCanvas = (selectedChatflow) => {
        navigate(`/${isAgentCanvas ? 'agentcanvas' : 'canvas'}/${selectedChatflow.id}`)
    }

    return (
        <>
            <TableContainer sx={{ border: 1, borderColor: theme.palette.grey[900] + 25, borderRadius: 2 }} component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
                    <TableHead
                        sx={{
                            backgroundColor: customization.isDarkMode ? theme.palette.common.black : theme.palette.grey[100],
                            height: 56
                        }}
                    >
                        <TableRow>
                            <StyledTableCell component='th' scope='row' style={{ width: '20%' }} key='0'>
                                Name
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '25%' }} key='1'>
                                Category
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '30%' }} key='2'>
                                Nodes
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '15%' }} key='3'>
                                Last Modified Date
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '10%' }} key='4'>
                                Actions
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <>
                                <StyledTableRow>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                </StyledTableRow>
                            </>
                        ) : (
                            <>
                                {/* {data.filter(filterFunction).map((row, index) => ( current
                                    <StyledTableRow key={index}>
                                        <TableCell key='0'>
                                            <Typography
                                                sx={{
                                                    fontSize: '1.2rem',
                                                    fontWeight: 500,
                                                    overflowWrap: 'break-word',
                                                    whiteSpace: 'pre-line'
                                                }}
                                            >
                                                <Button onClick={() => goToCanvas(row)} sx={{ textAlign: 'left' }}>
                                                    {row.templateName || row.name}
                                                </Button>
                                            </Typography>
                                        </TableCell>
                                        <TableCell key='1'> */}
                                {data?.filter(filterFunction).map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell key='0'>
                                            {/* <Tooltip title={row.templateName || row.name}> */}
                                            <Typography
                                                sx={{
                                                    display: '-webkit-box',
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <Button onClick={() => goToCanvas(row)} sx={{ textAlign: 'left' }}>
                                                    {row.templateName || row.name}
                                                </Button>
                                                {/* <Link
                                                        to={`/${isAgentCanvas ? 'agentcanvas' : 'canvas'}/${row.id}`}
                                                        style={{ color: '#2196f3', textDecoration: 'none' }}
                                                    >
                                                        {row.templateName || row.name}
                                                    </Link> */}
                                            </Typography>
                                            {/* </Tooltip> */}
                                        </StyledTableCell>
                                        <StyledTableCell key='1'>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    marginTop: 5
                                                }}
                                            >
                                                &nbsp;
                                                {row.category &&
                                                    row.category
                                                        .split(';')
                                                        .map((tag, index) => (
                                                            <Chip key={index} label={tag} style={{ marginRight: 5, marginBottom: 5 }} />
                                                        ))}
                                            </div>
                                            {/* </TableCell> current
                                        <TableCell key='2'>
                                            {images[row.id] && (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        flexWrap: 'wrap',
                                                        marginTop: 5 */}
                                        </StyledTableCell>
                                        <StyledTableCell key='2'>
                                            {images[row.id] && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'start',
                                                        gap: 1
                                                    }}
                                                >
                                                    {images[row.id]
                                                        .slice(0, images[row.id].length > 5 ? 5 : images[row.id].length)
                                                        .map((img) => (
                                                            // <div  current
                                                            //     key={img}
                                                            //     style={{
                                                            //         width: 35,
                                                            //         height: 35,
                                                            //         marginRight: 5,
                                                            //         borderRadius: '50%',
                                                            //         backgroundColor: 'white',
                                                            //         marginTop: 5
                                                            <Box
                                                                key={img}
                                                                sx={{
                                                                    width: 30,
                                                                    height: 30,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: customization.isDarkMode
                                                                        ? theme.palette.common.white
                                                                        : theme.palette.grey[300] + 75
                                                                }}
                                                            >
                                                                <img
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        padding: 5,
                                                                        objectFit: 'contain'
                                                                    }}
                                                                    alt=''
                                                                    src={img}
                                                                />
                                                                {/* </div> current */}
                                                            </Box>
                                                        ))}
                                                    {images[row.id].length > 5 && (
                                                        <Typography
                                                            sx={{
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                // fontSize: '.8rem', current
                                                                fontSize: '.9rem',
                                                                fontWeight: 200
                                                            }}
                                                        >
                                                            + {images[row.id].length - 5} More
                                                        </Typography>
                                                    )}
                                                    {/* </div> current
                                            )}
                                        </TableCell>
                                        <TableCell key='3'>{moment(row.updatedDate).format('MMMM Do, YYYY')}</TableCell>
                                        <TableCell key='4'> */}
                                                </Box>
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell key='3'>{moment(row.updatedDate).format('MMMM Do, YYYY')}</StyledTableCell>
                                        <StyledTableCell key='4'>
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                spacing={1}
                                                justifyContent='center'
                                                alignItems='center'
                                            >
                                                {/* <FlowListMenu chatflow={row} setError={setError} updateFlowsApi={updateFlowsApi} />
                                            </Stack>
                                        </TableCell> current */}
                                                <FlowListMenu
                                                    isAgentCanvas={isAgentCanvas}
                                                    chatflow={row}
                                                    setError={setError}
                                                    updateFlowsApi={updateFlowsApi}
                                                />
                                            </Stack>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

FlowListTable.propTypes = {
    data: PropTypes.array,
    images: PropTypes.object,
    isLoading: PropTypes.bool,
    filterFunction: PropTypes.func,
    updateFlowsApi: PropTypes.object,
    setError: PropTypes.func,
    isAgentCanvas: PropTypes.bool
}
