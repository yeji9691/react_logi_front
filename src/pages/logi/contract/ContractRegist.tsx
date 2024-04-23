import {
  Button,
  TextField,
  Grid,
  Box,
  InputLabel,
  FormControl,
  Modal,
  Select,
  MenuItem
} from '@mui/material';
import React, { useState } from 'react';
import Layout from 'layout';
import Page from 'ui-component/Page';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import { getEstimateData } from '../estimate/action/EstimateAction';
import { Contract } from 'types/logi/contract/tpyes';
import ContractModal from 'pages/utils/ContractModal';
import { ContractDetail } from 'types/logi/contract/tpyes';
import { dispatch } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

//✔️[수주 관리] 페이지
function ContractRegist() {
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [customerSearch, setCustomerSearch] = useState(false);
  const [dateSearch, setDateSearch] = useState(true);
  const [searchOpenDialog, setSearchOpenDialog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [contractDetail, setContractDetail] = useState<ContractDetail[]>([]);
  const [dateSearchCondition, setDateSearchCondition] = useState('estimateDate');
  const today = moment(new Date()).format('yyyy-MM-DD');

  //Modal Test
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen2 = () => {
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const [contractData, setContractData] = useState<Contract[]>([]);

  const columns = [
    {
      headerName: '견적일련번호',
      field: 'estimateNo',
      width: 150,
      editable: false
    },
    {
      headerName: '거래처코드',
      field: 'customerCode',
      width: 120,
      editable: false
    },
    {
      headerName: '견적일자',
      field: 'estimateDate',
      width: 120,
      editable: false
    },
    {
      headerName: '수주여부',
      field: 'contractStatus',
      width: 120,
      editable: false
    },
    {
      headerName: '견적요청자',
      field: 'estimateRequester',
      width: 120
    },
    {
      headerName: '유효일자',
      field: 'effectiveDate',
      width: 120,
      editable: false
    },
    {
      headerName: '견적담당자코드',
      field: 'personCodeInChange',
      width: 152
    },
    {
      headerName: '수주요청자',
      field: 'contractRequester',
      width: 120,
      editable: true,
      renderCell: (params) => (
        <TextField
          id="contractRequester"
          name="contractRequester"
          label=""
          sx={{
            m: 1,
            minWidth: 100
          }}
          onChange={handleChange}
        ></TextField>
      )
    },
    {
      headerName: '수주유형',
      field: 'contractType',
      width: 140,
      editable: true,
      renderCell: (params) => (
        <Box
          sx={{
            width: 150
          }}
        >
          <FormControl
            sx={{
              m: 1,
              minWidth: 100
            }}
          >
            <InputLabel>수주유형</InputLabel>
            <Select name="contractType" onChange={handleChange}>
              <MenuItem value="CT-01">긴급수주</MenuItem>
              <MenuItem value="CT-02">일반수주</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )
    },
    {
      headerName: '견적상세조회',
      field: 'estimateDetail',
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" color="secondary">
          내역확인
        </Button>
      )
    }
  ];

  const columns2 = [
    {
      headerName: '견적상세일련번호',
      field: 'estimateDetailNo'
    },
    {
      headerName: '견적수량',
      field: 'estimateAmount'
    },
    {
      headerName: '품목명',
      field: 'itemName'
    },
    {
      headerName: '견적단가',
      field: 'unitPriceOfEstimate'
    },
    {
      headerName: '합계액',
      field: 'sumPriceOfEstimate'
    },
    {
      headerName: '납기일',
      field: 'dueDateOfEstimate'
    }
  ];

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end' // 오른쪽 정렬
  };

  const textFieldStyle = {
    marginRight: '1vh', // 간격 조정
    flexGrow: 1, // TextField가 남은 공간을 모두 차지하도록 설정
    maxWidth: '120px' // 가로 크기 조정s
  };
  const buttonStyle = {
    fontSize: '0.8rem', // 버튼의 폰트 크기를 줄임
    padding: '0.3rem 1rem' // 버튼의 패딩을 조절
  };

  const onChangeDate = (e: any) => {
    if (e.target.id === 'startDate') {
      setStartDate(e.target.value);
      console.log('startDate', e.target.value);
      console.log('❇️startDate', startDate);
    } else {
      setEndDate(e.target.value);
      console.log('endDate', e.target.value);
      console.log('❇️endDate', endDate);
    }
  };

  const dispatch = useDispatch();

  const estimateData = useSelector((state) => state.estimate.estimateList);
  console.log("estimateData",estimateData)

  const handleEstimateRequest = () => {
    dispatch(getEstimateData({ startDate, endDate, dateSearchCondition }));
  };

  const [contractType, setContractType] = useState(''); // 상태 변수 추가
  const [contractRequester, setContractRequester] = useState(''); // 상태 변수 추가
  const [selList, setSelList] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [estimateDetail, setEstimateDetail] = useState([]);

  const handleChange = (e) => {
    console.log('수주', e);

    if (e.target.name === 'contractRequester') {
      console.log('contractRequester 값:', e.target.value);
      setContractRequester(e.target.value);
      // list.contractRequester = contractRequester;
    } else if (e.target.name === 'contractType') {
      console.log('contractType 값:', e.target.value);
      setContractType(e.target.value);
      // list.contractType = contractType;
    }
  };

  const submitContract = async () => {
    if (!contractType || !contractRequester) {
      alert('수주유형과 수주요청자를 모두 입력해주세요');
      return; // 유효한 데이터가 없으면 함수 종료
    }
    try {
      const combinedContract = {
        contractDate: today,
        estimateNo: selList.estimateNo,
        description: selList.description,
        customerCode: selList.customerCode,
        contractNo: selList.contractNo,
        personCodeInCharge: 'EMP-01',
        contractType: contractType, // 모달에서 입력한 수주유형
        contractRequester: contractRequester // 모달에서 입력한 수주요청자
      };

      const response = await axios.post('http://localhost:9102/logisales/contract/new', combinedContract);
      console.log('서버 응답:', response.data);
      alert('해당 수주가 등록되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('서버 요청 중 오류 발생: ', error);
      // 오류 처리를 추가하세요.
    }
  };

  const onRowClicked = (params) => {
    console.log('params', params);
    handleOpen();
    setSelList(params.row);
    setSelectedContract(params.row); // 선택한 견적 행 저장
  };

  const onCellClicked = (params) => {
    console.log('qqq', params);
    if (params.colDef.field === 'estimateDetail') {
      handleOpen2();
      console.log('params.row.estimateDetailTOList', params.row.estimateDetailTOList);
      setEstimateDetail(params.row.estimateDetailTOList);

      params.row.estimateDetailTOList;
    } else if (params.colDef.field === 'contractType' || params.colDef.field === 'contractRequester') {
      console.log('params.formattedValue', params.formattedValue);
      setContractRequester(params.formattedValue);
      setSelList(params.row);
      setSelectedContract(params.row); // 선택한 견적 행 저장
    }
  };

  return (
    <>
      {' '}
      <Page title="ContractSearch">
        {' '}
        <MainCard content={false} title="수주 등록">
          <MainCard>
            <Grid
              xs={12}
              sm={6}
              sx={{
                textAlign: 'none'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                <div
                  style={{
                    marginRight: '1vh',
                    marginTop: '1vh',
                    marginLeft: '1vh'
                  }}
                >
                  <div style={containerStyle}>
                    <InputLabel htmlFor="startDate">시작일</InputLabel>
                    <TextField id="startDate" onChange={onChangeDate} type={'date'} style={textFieldStyle} defaultValue={startDate} />
                    <InputLabel htmlFor="startDate">종료일</InputLabel>
                    <TextField id="endDate" onChange={onChangeDate} type={'date'} style={textFieldStyle} defaultValue={endDate} />
                  </div>
                </div>

                <Button
                  variant="contained"
                  color="secondary"
                  style={{
                    ...buttonStyle,
                    marginRight: '8px'
                  }}
                  onClick={() => handleEstimateRequest()}
                >
                  견적조회
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  style={{
                    ...buttonStyle,
                    marginLeft: '8px'
                  }}
                  onClick={() => submitContract()}
                >
                  수주등록
                </Button>
              </div>
            </Grid>
          </MainCard>
        </MainCard>
        <MainCard>
          <Box
            sx={{
              height: 500,
              width: '100%',
              background: 'white'
            }}
          >
            <DataGrid
              rows={estimateData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              getRowId={(row) => row.estimateNo}
              // onRowClick={onRowClicked}
              checkboxSelection
              onCellClick={onCellClicked}
            />{' '}
          </Box>
        </MainCard>
        <React.Fragment>
          <Modal open={open} onClose={handleClose} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
            <Box
              sx={{
                ...style,
                width: 500,
                height: 250,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h2
                style={{
                  marginBottom: '10px'
                }}
              >
                수주요청자 및 유형 등록
              </h2>

              <FormControl
                sx={{
                  m: 1,
                  Width: 70
                }}
              >
                <InputLabel>수주유형</InputLabel>
                <Select name="contractType" onChange={handleChange}>
                  <MenuItem value="CT-01">긴급수주</MenuItem>
                  <MenuItem value="CT-02">일반수주</MenuItem>
                </Select>
              </FormControl>

              <TextField
                id="contractRequester"
                name="contractRequester"
                label="수주요청자"
                sx={{
                  m: 1,
                  minWidth: 100
                }}
                onChange={handleChange}
              ></TextField>

              <Button
                onClick={handleClose}
                style={{
                  marginLeft: 'auto'
                }}
              >
                Next
              </Button>
            </Box>
          </Modal>
        </React.Fragment>
        <React.Fragment>
          <Modal open={open2} onClose={handleClose2}>
            <Box
              sx={{
                ...style,
                width: 800,
                height: 400,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h2
                style={{
                  marginBottom: '10px'
                }}
              >
                견적상세내역
              </h2>
              <MainCard>
                <Box
                  sx={{
                    height: 300,
                    width: '100%',
                    background: 'white'
                  }}
                >
                  <DataGrid
                    rows={estimateDetail}
                    columns={columns2}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.estimateDetailNo}
                  />{' '}
                </Box>
              </MainCard>
              <Button
                onClick={handleClose2}
                style={{
                  marginLeft: 'auto'
                }}
              >
                Close
              </Button>
            </Box>
          </Modal>
        </React.Fragment>
      </Page>
    </>
  );
}

ContractRegist.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ContractRegist;
