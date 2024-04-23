import React, { ReactElement, useEffect, useState, useCallback } from 'react';

// material-ui
import { Button, Grid, Stack, Box } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { MpsTO } from 'types/logi/mrp/types';
import MyCalendar from 'pages/utils/Mycalender';
import { today } from 'utils/hr/lib';
import Swal from 'sweetalert2';

// assets
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

//columns information
// const columns: ColumnProps[] = [
//   { id: 'mpsNo', label: 'MPS번호', minWidth: 100, align: 'center' },
//   { id: 'mpsPlanClassification', label: '계획구분', minWidth: 100, align: 'center' },
//   { id: 'contractDetailNo', label: '수주상세번호', minWidth: 100, align: 'center' },
//   { id: 'salesPlanNo', label: '판매계획', minWidth: 100, align: 'center' },
//   { id: 'itemCode', label: '품목코드', minWidth: 100, align: 'center' },
//   { id: 'itemName', label: '품목명', minWidth: 130, align: 'center' },
//   { id: 'unitOfMps', label: '단위', minWidth: 100, align: 'center' },
//   { id: 'mpsPlanDate', label: 'MPS계획일자', minWidth: 120, align: 'center' },
//   { id: 'mpsPlanAmount', label: 'MPS계획수량', minWidth: 90, align: 'center' },
//   { id: 'dueDateOfMps', label: '납기일', minWidth: 90, align: 'center' },
//   { id: 'scheduledEndDate', label: '출하예정일', minWidth: 90, align: 'center' },
//   { id: 'mrpApplyStatus', label: 'MRP적용상태', minWidth: 90, align: 'center' },
//   { id: 'description', label: '설명', minWidth: 90, align: 'center' }
// ];

// ==============================|| TABLE - COLLAPSIBLE ||============================== //

function SetMrpgrid() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [checkData, setCheckData] = useState(null);
  const [mrpDialog, setMrpDialog] = useState(false);
  const [dateSearchCondition, setDateSearchCondition] = useState('estimateDate');
  const [contractData, setContractData] = useState<MpsTO[]>([]);
  const [calendarDate, setCalendarDate] = useState({
    startDate: today,
    endDate: today
  });
  const [contractList, setContractList] = useState([]);

  // const searchMps = useCallback(() => {
  //   searchMpsInfoInMrp(setContractList, calendarDate); // searchContractDetailInMpsAvailable -> searchMpsInfo
  // }, [calendarDate]);

  //MPS조회누르면 데이터가 뜨긴하는데 라인이 안맞음 ㅈㅅ;;
  const [rowData, setRowData] = useState<MpsTO[]>([]);
  const mrpRegister = useCallback(() => {
    console.log(checkData);

    if (!checkData) {
      Swal.fire('알림', '모의전개할 mps를 선택하십시오.', 'info');
      return;
    }

    setMrpDialog(true);
  }, [checkData]);

  const searchMps = async () => {
    try {
      const params = {
        startDate: startDate,
        endDate: endDate,
        dateSearchCondition: dateSearchCondition
      };

      const response = await axios.get('http://localhost:9102/production/mps/list', { params: params });

      setContractData(response.data.gridRowJson);
      console.log('서버에서 받은 데이터 ㅇㅁㅇ!!!:', response.data.gridRowJson);
    } catch (error) {
      console.error('데이터를 불러오는 중 에러 발생:', error);
    }
  };

  useEffect(() => {
    // fetchData 함수를 호출하여 데이터 가져오기
    searchMps();
  }, []);

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

  // const textFieldStyle = {
  //   marginRight: '1vh', // 간격 조정
  //   flexGrow: 1, // TextField가 남은 공간을 모두 차지하도록 설정
  //   maxWidth: '120px' // 가로 크기 조정s
  // };

  // const buttonStyle = {
  //   fontSize: '0.8rem', // 버튼의 폰트 크기를 줄임
  //   padding: '0.3rem 1rem' // 버튼의 패딩을 조절
  // };

  //MPS조회 행 클릭 시  선택된 정보 데이터 저장 로직

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end' // 오른쪽 정렬
  };

  //Table Data
  const Columns = [
    {
      headerName: 'MPS번호',
      field: 'mpsNo',
      width: 200,
      suppressSizeToFit: true,
      headerCheckboxSelection: false,
      headerCheckboxSelectionFilteredOnly: true,
      suppressRowClickSelection: true,
      checkboxSelection: true
    },
    { headerName: '계획구분', field: 'mpsPlanClassification', width: 150 },
    { headerName: '수주상세번호', field: 'contractDetailNo' },
    { headerName: '판매계획', field: 'salesPlanNo', hide: true },
    { headerName: '품목코드', field: 'itemCode', width: 120 },
    { headerName: '품목명', field: 'itemName', width: 120 },
    { headerName: '단위', field: 'unitOfMps', width: 80 },
    {
      headerName: 'MPS계획일자',
      field: 'mpsPlanDate',
      width: 120
    },

    {
      headerName: '출하예정일',
      field: 'scheduledEndDate',
      width: 120
    }
  ];
  return (
    <Page title="MRP(자재소요계획) 관리">
      <Grid item xs={12}>
        <div id="grid-wrapper">
          <MainCard
            content={false}
            title="MPS조회"
            secondary={
              <Stack direction="row" spacing={2} alignItems="center">
                <SecondaryAction link="https://next.material-ui.com/components/tables/" />
              </Stack>
            }
          >
            <div style={containerStyle}>
              <MyCalendar onChangeDate={onChangeDate} />
              <Button
                variant={'contained'}
                color={'secondary'}
                // className={dark ? classes.whiteButton : classes.searchButton}
                onClick={() => searchMps()}
              >
                MPS조회
              </Button>
              <Button
                variant={'contained'}
                color={'secondary'}
                name={'confirm'}
                onClick={mrpRegister}
                // className={dark ? classes.whiteButton : classes.searchButton}
              >
                MRP모의전개
              </Button>
            </div>
          </MainCard>
          {/* table */}
          <MainCard>
            <Box
              sx={{
                height: 500,
                width: '100%',
                background: 'white'
              }}
            >
              <DataGrid
                rows={contractData}
                columns={Columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={(row) => row.mpsNo}
                // onRowClick={onRowClicked}
                checkboxSelection
              />{' '}
            </Box>
          </MainCard>
        </div>
      </Grid>
    </Page>
  );
}

SetMrpgrid.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SetMrpgrid;
