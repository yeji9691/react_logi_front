import React, { ReactElement, useCallback, useState } from 'react';

// material-ui
import { Button, Grid, Box } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import MainCard from 'ui-component/cards/MainCard';
import { MpsTO } from 'types/logi/mrp/types';
import MyCalendar from 'pages/utils/Mycalender';
import Swal from 'sweetalert2';
import { convertContractDetailToMps, searchContractDetailInMpsAvailable } from './mpsAxios';
import MyDialog from 'pages/utils/MyDialog';
import MpsDialog from './MpsDialog';

// assets
import axios from 'axios';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ContractDetailInMpsAvailableTO } from 'types/logi/mps/types';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { dispatch } from 'store';
import { getMpsList } from 'store/slices/mps';

//columns information
//MPS 등록가능 -> 조회되는 Column
// const columns: ColumnProps[] = [
//   { id: 'contractDetailNo', label: '수주상세일련번호', minWidth: 100, align: 'center' },
//   { id: 'contractType', label: '유형', minWidth: 100, align: 'center' },
//   { id: 'planClassification', label: '계획구분', minWidth: 100, align: 'center' },
//   { id: 'contractDate', label: '수주일자', minWidth: 100, align: 'center' },
//   { id: 'estimateAmount', label: '견적수량', minWidth: 100, align: 'center' },
//   { id: 'stockAmountUse', label: '초기납품', minWidth: 130, align: 'center' },
//   { id: 'productionRequirement', label: '제작수량', minWidth: 100, align: 'center' },
//   { id: 'mpsPlanDate', label: 'MPS계획일자', minWidth: 120, align: 'center' },
//   { id: 'scheduledEndDate', label: '출하예정일', minWidth: 90, align: 'center' },
//   { id: 'dueDateOfMps', label: '납기일', minWidth: 90, align: 'center' },
//   { id: 'itemName', label: '품목명', minWidth: 90, align: 'center' },
//   { id: 'description', label: '설명', minWidth: 90, align: 'center' }
// ];
const contractlistcolumn = [
  {
    headerName: '수주상세일련번호',
    field: 'contractDetailNo'
  },
  { headerName: '유형', field: 'contractType' },
  { headerName: '계획구분', field: 'planClassification', hide: true },
  { headerName: '수주일자', field: 'contractDate' },
  { headerName: '견적수량', field: 'estimateAmount' },
  { headerName: '초기납품', field: 'stockAmountUse' },
  { headerName: '제작수량', field: 'productionRequirement', editable: true },
  {
    headerName: '계획일자',
    field: 'mpsPlanDate',
    editable: true
  },
  {
    headerName: '출하예정일',
    field: 'scheduledEndDate',
    editable: true
  },
  { headerName: '납기일', field: 'dueDateOfContract' },
  { headerName: '거래처코드', field: 'customerCode', hide: true },
  { headerName: '품목코드', field: 'itemCode', hide: true },
  { headerName: '품목명', field: 'itemName' },
  { headerName: '단위', field: 'unitOfContract', hide: true },
  { headerName: '비고', field: 'description', editable: true, hide: true }
];
// ==============================|| TABLE - COLLAPSIBLE ||============================== //

function MpsContainer() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateSearchCondition, setDateSearchCondition] = useState('includeMrpApply');
  // const [checkData, setCheckData] = useState(null);
  // const [mrpDialog, setMrpDialog] = useState(false);
  // const [contractGridApi, setcontractGridApi] = useState();
  const [selectedRows, setSelectedRows] = useState([]); // 선택된 행을 저장하기 위한 상태 추가
  const [contractData, setContractData] = useState<MpsTO[]>([]);
  const [selList, setSelList] = useState([]);
  const [mpsDialog, setMpsDialog] = useState(false);
  const [calendarDate, setCalendarDate] = useState({
    startDate: startDate,
    endDate: endDate
  });

  //MPS등록
  //MPS등록 버튼 클릭 시 조회된 MPS가 등록됨
  //MPS 등록 버튼 클릭 시 선택된 행을 처리하는 함수
  const onClickMpsInsert = () => {
    if (selectedRows.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: '조회부터하셈'
      });
    }

    selectedRows.forEach((row) => {
      if (
        row.mpsPlanDate === null ||
        row.scheduledEndDate === null ||
        row.mpsPlanDate === '' ||
        row.scheduledEndDate === '' ||
        row.productionRequirement === null ||
        row.productionRequirement === ''
      ) {
        return Swal.fire({
          icon: 'error',
          title: '계획일자,출하예정일 \r\n 값을 입력해주세요'
        });
      }
      // 필요한 데이터를 추출합니다.
      const dataToSubmit = {
        contractlistcolumn: contractlistcolumn
      };

      // MPS 등록 API를 호출하고 데이터를 서버로 보냅니다.
      convertContractDetailToMps(dataToSubmit);
    });

    // 선택된 행을 DataGrid에서 제거
    const newRows = ContractList.filter((row) => !selectedRows.includes(row.contractDetailNo));
    setSelectedRows([]); // 선택된 행을 초기화합니다.
    dispatch(getMpsList(newRows)); // DataGrid 업데이트

    // console.log('row : ', row);
    // let newRow = { ...row, planClassification: '수주상세' };
    // console.log('newRow : ', newRow);
    // convertContractDetailToMps(newRow);
    // let selectRows = contractGridApi.getSelectedRows();
    // contractGridApi.updateRowData({ remove: selectRows });
  };

  //MPS 조회
  //MPS 조회 버튼을 누르면 현재 등록되어 있는 MPS리스트가 조회됨
  const onClickSearchMps = async () => {
    try {
      const params = {
        startDate: startDate,
        endDate: endDate,
        includeMrpApply: dateSearchCondition
      };

      const response = await axios.get('http://localhost:9102/production/mps/list', { params: params });

      setContractData(response.data.gridRowJson);
      setMpsDialog(true);
      console.log('서버에서 받은 데이터 ㅇㅁㅇ!!!:', response.data);
    } catch (error) {
      console.error('데이터를 불러오는 중 에러 발생:', error);
    }
  };

  //close를 누르면 'ref' undefined가 뜨는데 이거 해결해야함 Sorry~^.^
  const mpsClose = () => {
    setMpsDialog(false);
  };

  // MPS 등록 가능 조회
  // 버튼 클릭 시 등록가능한 MPS 리스트가 column에 맞춰서 조회됨

  // Slice를 이용한 방법
  // const ContractList = useSelector((state: any) => state.mps.mpsList);
  // const onClickSearchContract = () => {
  //   //   let params = {
  //   //     startDate: startDate,
  //   //     endDate: endDate,
  //   //     searchCondition: 'contractDate'
  //   //   };
  //   //   dispatch(getMpsList(params) as any);
  // };
  const [ContractList, setContractList] = useState<ContractDetailInMpsAvailableTO[]>([]);

  const onClickSearchContract = useCallback(() => {
    searchContractDetailInMpsAvailable(setContractList, startDate, endDate);
    console.log('@@@@@@@@@@@@@@@@', ContractList);
  }, [startDate, endDate]);
  console.log('바보진수형~~~~', ContractList);
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

  //2023-11-01(수) Hoyeon
  //data grid 사용을 위한 컬럼 정의
  const theme = useTheme();
  //UI에 나타나는 화면 출력
  return (
    <Page title="MPS(주 생산계획) 관리">
      <Grid item xs={12}>
        <div id="grid-wrapper">
          <MainCard
            content={false}
            title="MPS 등록 및 조회"
            secondary={
              <Grid item xs={12} sm={6}>
                <div style={{ float: 'left' }}>
                  <MyCalendar onChangeDate={onChangeDate} />
                  <Button variant="contained" color="secondary" style={{ marginRight: '1vh', marginTop: '1vh' }} onClick={onClickMpsInsert}>
                    MPS 등록
                  </Button>
                </div>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginRight: '1vh', marginTop: '1vh' }}
                  onClick={onClickSearchContract}
                >
                  MPS등록 가능 조회
                </Button>
                <Button variant="contained" color="secondary" style={{ marginRight: '1vh', marginTop: '1vh' }} onClick={onClickSearchMps}>
                  MPS 조회
                </Button>
              </Grid>
            }
          >
            <MyDialog open={mpsDialog} close={mpsClose} maxWidth={'sm'}>
              {/* MpsDialog의 mpsList와 calendarDate를 불러옴*/}
              <div>
                <MpsDialog mpsList={contractData} calendarDate={calendarDate} />
              </div>
            </MyDialog>

            <Box
              sx={{
                height: 300,
                width: '100%',
                '& .MuiDataGrid-root': {
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                  },
                  '& .MuiDataGrid-columnsContainer': {
                    color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                  },
                  '& .MuiDataGrid-columnSeparator': {
                    color: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                  }
                }
              }}
            >
              <DataGrid
                hideFooter
                rows={ContractList}
                columns={contractlistcolumn}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={(row) => row.contractNo}
                checkboxSelection
                selectionModel={selectedRows} // 선택된 행 상태
              />
            </Box>
          </MainCard>
        </div>
      </Grid>
    </Page>
  );
}
MpsContainer.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MpsContainer;
