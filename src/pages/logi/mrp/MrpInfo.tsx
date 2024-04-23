// 이 페이지는 페이지는 정상적으로 나오는데 애초에 리엑트부터 기능 구현이 안되어있음....
// 구현을 부탁합니다^^

import React, { ReactElement, useState } from 'react';

// material-ui
import { Button, Grid, Box } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/ui-component/Page';
import MainCard from 'ui-component/cards/MainCard';
import { MrpGatheringTO, MrpTO } from 'types/logi/mrp/types';
import MyDialog from 'pages/utils/MyDialog';

// assets
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import GatherDialog from './GatherDialog';

const mrpinfolistcolumn = [
  {
    headerName: '소요량전개번호',
    field: 'mrpNo'
  },
  { headerName: '주생산계획번호', field: 'mpsNo' },
  { headerName: '품목분류', field: 'itemClassification' },
  { headerName: '품목코드', field: 'itemCode' },
  { headerName: '품목명', field: 'itemName' },
  {
    headerName: '발주/작업지시 기한',
    field: 'orderDate',
    cellRenderer: function (params: any) {
      if (params.value == null) {
        params.value = '';
      }
      return '📅 ' + params.value;
    }
  },
  {
    headerName: '발주/작업지시완료기한',
    field: 'requiredDate',
    cellRenderer: function (params: any) {
      if (params.value == null) {
        params.value = '';
      }
      return '📅 ' + params.value;
    }
  },
  { headerName: '필요수량', field: 'requiredAmount' },
  { headerName: '단위', field: 'unitOfMrp' }
];
// ==============================|| TABLE - COLLAPSIBLE ||============================== //

const MrpInfo = (props: any) => {
  const [gatherDialog, setGatherDialog] = useState(false);
  const [mrpNoList, setMrpNoList] = useState<MrpTO[]>([]);
  const [searchGatherList, setsearchGatherList] = useState<MrpGatheringTO[]>([]);
  const [GatherList, setGatherList] = useState([]);
  const [GatherInsert, setGatherInsert] = useState([]);
  const [mrpNoAndItemCodelist, setmrpNoAndItemCodelist] = useState([]);

  const mrpClose = () => {
    setGatherDialog(false);
  };
  //소요량 취합 결과 조회
  const MrpGatherRegister = () => {
    const mrpNoData = [];
    const mrpNoAndItemCode = {};

    const size = props.MrpGetList;

    for (let mrpNumber = 0; mrpNumber < size; mrpNumber++) {
      console.log(props.MrpGetList[mrpNumber]);

      mrpNoData.push(props.MrpGetList[mrpNumber].mrpNo);
      console.log(props.MrpGetList[mrpNumber].mrpNo + '' + props.MrpGetList[mrpNumber].itemCode);
      mrpNoAndItemCode[props.MrpGetList[mrpNumber].mrpNo] = props.MrpGetList[mrpNumber].itemCode;
    }

    setMrpNoList(mrpNoData);
    setmrpNoAndItemCodelist(mrpNoAndItemCode);

    setGatherDialog(true);
  };

  //2023-11-08(수) Hoyeon
  //data grid 사용을 위한 컬럼 정의
  const theme = useTheme();
  //UI에 나타나는 화면 출력
  return (
    <Page title="MRP 소요량 취합">
      <Grid item xs={12}>
        <div id="grid-wrapper">
          <MainCard
            content={false}
            title="소요량취합"
            secondary={
              <Grid item xs={12} sm={6}>
                <Button variant="contained" color="secondary" style={{ marginRight: '1vh', marginTop: '1vh' }} onClick={MrpGatherRegister}>
                  소요량 취합 결과 조회
                </Button>
              </Grid>
            }
          >
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
                rows={mrpNoList}
                columns={mrpinfolistcolumn}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={(row) => row.mrpNo}
              />
            </Box>
            <MyDialog open={gatherDialog} close={mrpClose} maxWidth={'90%'}>
              <div>
                <GatherDialog
                  mrpNoData={mrpNoList}
                  searchGatherList={props.searchGatherList}
                  GatherList={props.GatherList}
                  GatherInsert={props.GatherInsert}
                  mrpNoAndItemCodelist={mrpNoAndItemCodelist}
                />
              </div>
            </MyDialog>
          </MainCard>
        </div>
      </Grid>
    </Page>
  );
};
MrpInfo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MrpInfo;
