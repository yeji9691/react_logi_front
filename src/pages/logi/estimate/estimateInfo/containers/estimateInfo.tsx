import React, { ReactElement, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { EstimateTO, EstimateDetail } from 'types/logi/estimate/types';
// assets
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// import { requestEstimate } from '../../redux/reducer/estimateReducer';
import { getEstimateData } from '../../action/EstimateAction';

// 견적 조회/수정
// table data
type BasicTableData = {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  price: number;
  history?: { date: string; customerId: string; amount: number }[];
};

const buttonStyle = {
  fontSize: '0.8rem', // 버튼의 폰트 크기를 줄임
  padding: '0.3rem 1rem' // 버튼의 패딩을 조절
};

const textFieldStyle = {
  marginRight: '1vh', // 간격 조정
  flexGrow: 1, // TextField가 남은 공간을 모두 차지하도록 설정
  maxWidth: '120px' // 가로 크기 조정s
};
function Row({ item }: { item: EstimateTO }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [estimateDetail, setEstimateDetail] = useState<EstimateDetail[]>([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dueDateOfEstimate, setDueDateOfEstimate] = useState('');
  const [unitPriceOfEstimate, setUnitPriceOfEstimate] = useState(0);
  const [sumPriceOfEstimate, setSumPriceOfEstimate] = useState(0);
  const [estimateAmount, setEstimateAmount] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [itemUnit, setItemUnit] = useState({ name: '', price: 0, code: '' });
  const [updateEstimateDetail, setUpdateEstimateDetail] = useState<EstimateDetail>();
  const [rowData, setRowData] = useState({
    selectedOption: item.estimateDetailTOList[0].itemName,
    unitPriceOfEstimate: item.estimateDetailTOList[0].unitPriceOfEstimate
  });
  const [estimateDetailData, setEstimateDetailData] = useState(item.estimateDetailTOList.map((detail) => ({ ...detail })));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get('http://localhost:9102/compinfo/codedetail/list', {
        params: {
          divisionCodeNo: 'IT-_I'
        }
      });
      // 서버에서 가져온 데이터 중 detailCodeName만 options 배열로 설정
      const optionData = result.data.codeList.map((item) => item.detailCodeName);
      setOptions(optionData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const changeData = async (estimateDetailNo: string) => {
    const newData: EstimateDetail = {
      itemCode: itemUnit.code,
      itemName: itemUnit.name,
      estimateDetailNo: estimateDetailNo,
      estimateNo: item.estimateNo,
      unitOfEstimate: 'EA',
      dueDateOfEstimate: dueDateOfEstimate,
      estimateAmount: estimateAmount,
      unitPriceOfEstimate: unitPriceOfEstimate,
      sumPriceOfEstimate: sumPriceOfEstimate,
      description: '',
      status: 'UPDATE'
    };

    setUpdateEstimateDetail(newData);

    await updateEstimate(newData);
  };

  const updateEstimate = async (updateEstimateDetail: EstimateDetail) => {
    try {
      console.log('\n\nupdateEstimateDetail\n\n', updateEstimateDetail);

      // FormData 객체 생성
      const formData = new FormData();

      // "batchList" 파라미터에 객체 추가
      formData.append('batchList', JSON.stringify([updateEstimateDetail]));
      console.log('@@', formData);

      const response = await axios.post('http://localhost:9102/logisales/estimatedetail/batch', formData);
      console.log('서버 응답 데이터:', response.data); // 서버 응답 데이터를 콘솔에 출력
      alert('견적상세내역이 수정되었습니다.');
    } catch (error) {
      // 오류 처리
    }
  };

  const handleDeleteDetail = async (index: number) => {
    // 복제된 배열을 만들고, 삭제할 항목을 제외한 배열을 생성하여 상태를 업데이트합니다.
    const newDetail = [...estimateDetail];
    const deletedEstimateDetail = newDetail.splice(index, 1)[0]; // 해당 인덱스의 항목을 제거하고 저장
    setEstimateDetail(newDetail);

    // 서버에 해당 데이터 삭제 요청 보내기
    try {
      await axios.delete('http://localhost:9102/logisales/estimate', {
        params: { estimateNo: deletedEstimateDetail.estimateNo, status: 'DELETE' }
      });
      alert('견적상세내역이 삭제되었습니다.');
      window.location.reload();
    } catch (error) {
      // 오류 처리
      console.error('Error deleting data:', error);
    }
  };

  useEffect(() => {
    let updatedItemUnit = { name: '', price: 0, code: '' };
    let updatedUnitPriceOfEstimate = 0;
    if (selectedOption === '디지털카메라 NO.1') {
      updatedItemUnit = { name: '디지털카메라 NO.1', price: 1000000, code: 'DK-01' };
    } else if (selectedOption === '디지털카메라 NO.2') {
      updatedItemUnit = { name: '디지털카메라 NO.2', price: 900000, code: 'DK-02' };
    } else if (selectedOption === '카메라 본체 NO.1') {
      updatedItemUnit = { name: '카메라 본체 NO.1', price: 75000, code: 'DK-AP01' };
    } else {
      updatedItemUnit = { name: '카메라 본체 NO.2', price: 71000, code: 'DK-AP02' };
    }

    setItemUnit(updatedItemUnit);
    setSumPriceOfEstimate(estimateAmount * itemUnit.price);
    setUnitPriceOfEstimate(updatedUnitPriceOfEstimate);
  }, [selectedOption, estimateAmount]);

  const handleItemNameChange = (e: any, rowIndex: number) => {
    const newSelectedOption = e.target.value;
    const newEstimateAmount = estimateAmount;

    // calculateUnitPrice 함수를 호출하여 단위 가격과 합계액 계산
    const { unitPrice, sumPrice } = calculateUnitPrice(newSelectedOption, newEstimateAmount);

    const updatedEstimateDetailData = [...estimateDetailData];

    // 해당 행의 아이템과 합계액을 업데이트
    updatedEstimateDetailData[rowIndex].unitPriceOfEstimate = unitPrice;
    updatedEstimateDetailData[rowIndex].sumPriceOfEstimate = sumPrice;

    setEstimateDetailData(updatedEstimateDetailData);
  };

  const calculateUnitPrice = (selectedOption: any, estimateAmount: number) => {
    console.log('selectedOptionselectedOption', selectedOption);
    let unitPrice = 0;
    if (selectedOption === '디지털카메라 NO.1') {
      unitPrice = 1000000;
    } else if (selectedOption === '디지털카메라 NO.2') {
      unitPrice = 900000;
    } else if (selectedOption === '카메라 본체 NO.1') {
      unitPrice = 75000;
    } else if (selectedOption === '카메라 본체 NO.2') {
      unitPrice = 71000;
    }

    const sumPrice = unitPrice * estimateAmount;
    setSumPriceOfEstimate(sumPrice);
    setUnitPriceOfEstimate(unitPrice);
    return { unitPrice, sumPrice };
  };

  const onChangeData2 = (e: any) => {
    if (e.target.id === 'dueDateOfEstimate') {
      const dateString = e.target.value.toString(); // 문자열로 변환
      setDueDateOfEstimate(dateString);
    } else if (e.target.id === 'estimateAmount') {
      setEstimateAmount(e.target.value);
      estimateAmount;
    } else if (e.target.id === 'sumPriceOfEstimate') {
      setSumPriceOfEstimate(e.target.value);
    } else if (e.target.name === 'itemName') {
      const selectedOption = e.target.value;
      setRowData({
        ...rowData,
        selectedOption
      });
    } else if (e.target.id === 'unitPriceOfEstimate') {
      setUnitPriceOfEstimate(e.target.value);
    }
  };
  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{item.estimateNo}</TableCell>
        <TableCell>{item.customerCode}</TableCell>
        <TableCell>{item.estimateDate}</TableCell>
        <TableCell>{item.contractStatus}</TableCell>
        <TableCell>{item.estimateRequester}</TableCell>
        <TableCell>{item.effectiveDate}</TableCell>
        <TableCell>{item.personCodeInCharge}</TableCell>
        <TableCell>{item.description}</TableCell>
        {
          <TableCell sx={{ pl: 3 }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open);
                setEstimateDetail(item.estimateDetailTOList);
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        }
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {open && (
              <Box sx={{ margin: 1 }}>
                <TableContainer>
                  <SubCard
                    sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.50', mb: 2 }}
                    title="견적상세조회"
                    content={false}
                  >
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow></TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>견적상세일련번호</TableCell>
                          <TableCell>견적수량</TableCell>
                          <TableCell>품목명</TableCell>
                          <TableCell>견적단가</TableCell>
                          <TableCell>합계액</TableCell>
                          <TableCell>납기일</TableCell>
                          <TableCell>수정</TableCell>
                          <TableCell>삭제</TableCell>
                        </TableRow>
                        {estimateDetail.map((detail, index) => (
                          <TableRow>
                            <TableCell>{detail.estimateDetailNo}</TableCell>
                            <TableCell>
                              <TextField
                                id="estimateAmount"
                                name="estimateAmount"
                                label={detail.estimateAmount}
                                sx={{ m: 1, minWidth: 100 }}
                                onChange={onChangeData2}
                              />
                            </TableCell>
                            <TableCell data-action="itemName">
                              <FormControl sx={{ m: 1, minWidth: 140 }}>
                                <InputLabel id={`itemName-select-${index}`}>{detail.itemName}</InputLabel>
                                <Select
                                  name="itemName"
                                  onChange={(e) => {
                                    console.log('eeee', e);
                                    handleItemNameChange(e, index);
                                    onChangeData2(e);
                                  }}
                                >
                                  {options.map((option, index) => (
                                    <MenuItem key={index} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>

                            <TableCell onChange={onChangeData2}>
                              {estimateDetailData[index] ? estimateDetailData[index].unitPriceOfEstimate : unitPriceOfEstimate}
                            </TableCell>

                            <TableCell id="sumPriceOfEstimate" data-action="sumPriceOfEstimate" onChange={onChangeData2}>
                              {estimateDetailData[index] ? estimateDetailData[index].sumPriceOfEstimate : sumPriceOfEstimate}
                            </TableCell>

                            <TableCell>
                              <TextField
                                id="dueDateOfEstimate"
                                onChange={onChangeData2}
                                type={'date'}
                                style={textFieldStyle}
                                defaultValue={detail.dueDateOfEstimate}
                              />
                            </TableCell>

                            <TableCell>
                              <Button
                                variant="contained"
                                color="secondary"
                                style={buttonStyle}
                                onClick={() => {
                                  changeData(detail.estimateDetailNo);
                                  console.log('dtail');
                                }}
                              >
                                수정
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button variant="contained" color="secondary" style={buttonStyle} onClick={() => handleDeleteDetail(index)}>
                                삭제
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </SubCard>
                </TableContainer>
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ==============================|| TABLE - COLLAPSIBLE ||============================== //
function estimateInfo() {
  const [dateSearchCondition, setDateSearchCondition] = useState('estimateDate');
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [contractData, setContractData] = useState<EstimateTO[]>([]);
  const [sagaEstimateData, setSagaEstimateData] = useState<EstimateTO[]>([]);

  const dispatch = useDispatch();

  const estimateData = useSelector((state) => state.estimate.estimateList);

  console.log('estimateDataaaaaa', estimateData);

  // useEffect(() => {

  //   dispatch(requestEstimate({startDate,endDate,dateSearchCondition}))

  // }, [startDate,endDate,dateSearchCondition])

  const handleEstimateRequest = () => {
    dispatch(getEstimateData({ startDate, endDate, dateSearchCondition }));
  };

  // const fetchData = async () => {
  //   try {
  //     const params = {
  //       startDate: startDate,
  //       endDate: endDate,
  //       dateSearchCondition: dateSearchCondition,
  //     };

  //     const response = await axios.get('http://localhost:9102/logisales/estimate/list', {params: params,});

  //     setContractData(response.data.gridRowJson);
  //     console.log('서버에서 받은 데이터 ㅇㅁㅇ!!!:', response.data.gridRowJson);

  //   } catch (error) {
  //     console.error('데이터를 불러오는 중 에러 발생:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleRadioChange = (event: any) => {
    if (event.target.value === 'estimateDate') {
      setDateSearchCondition('estimateDate');
    } else if (event.target.value === 'effectiveDate') {
      setDateSearchCondition('effectiveDate');
    }
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

  const textFieldStyle = {
    marginRight: '1vh', // 간격 조정
    flexGrow: 1, // TextField가 남은 공간을 모두 차지하도록 설정
    maxWidth: '120px' // 가로 크기 조정s
  };
  const buttonStyle = {
    fontSize: '0.8rem', // 버튼의 폰트 크기를 줄임
    padding: '0.3rem 1rem' // 버튼의 패딩을 조절
  };
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end' // 오른쪽 정렬
  };

  return (
    <Page title="Collapse Table">
      <MainCard
        content={false}
        title="견적 조회"
        secondary={
          <Stack direction="row" spacing={2} alignItems="center">
            <SecondaryAction link="https://next.material-ui.com/components/tables/" />
          </Stack>
        }
      >
        <div style={containerStyle}>
          <FormControl component="fieldset" error={true} style={{ marginLeft: '10px' }}>
            <RadioGroup row aria-label="quiz" name="quiz" value={dateSearchCondition} onChange={handleRadioChange}>
              <FormControlLabel value="estimateDate" control={<Radio />} label="견적일자" />
              <FormControlLabel value="effectiveDate" control={<Radio />} label="유효일자" />
            </RadioGroup>
          </FormControl>

          <InputLabel htmlFor="startDate">시작일</InputLabel>
          <TextField id="startDate" onChange={onChangeDate} type={'date'} style={textFieldStyle} defaultValue={startDate} />
          <InputLabel htmlFor="startDate">종료일</InputLabel>
          <TextField id="endDate" onChange={onChangeDate} type={'date'} style={textFieldStyle} defaultValue={endDate} />
          <Button
            variant="contained"
            color="secondary"
            style={buttonStyle}
            onClick={() => handleEstimateRequest()} // 버튼 클릭 시 fetchDataFromServer 함수 호출
          >
            견적조회
          </Button>
        </div>
        {/* table */}
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>견적일련번호</TableCell>
                <TableCell>거래처코드</TableCell>
                <TableCell>견적일자</TableCell>
                <TableCell>수주여부</TableCell>
                <TableCell>견적요청자</TableCell>
                <TableCell>유효일자</TableCell>
                <TableCell>견적담당자</TableCell>
                <TableCell>비고</TableCell>
                <TableCell>견적상세조회🔻</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estimateData.length > 0 ? (
                estimateData.map((item: EstimateTO) => <Row key={item.estimateNo} item={item} />)
              ) : (
                <MainCard style={{ textAlign: 'center', padding: '100px 0', display: 'flex', height: '100vh' }}></MainCard>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </Page>
  );
}
estimateInfo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default estimateInfo;
