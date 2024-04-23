import React, { useEffect, useState } from 'react';
import MyGrid from 'pages/utils/Mygrid';
import mrpListColumn from 'pages/logi/mrp/mrpColumn';
//import useStyles from './useStyles';
import { TextField, Button } from '@mui/material';
import useInput from 'utils/useInput';
import { today } from 'utils/hr/lib';

const Mrpdialog = ({ checkData, setCheckData, searchMrpList, MrpSimulatorList, MrpRegisterList, mrpRegisterGridApi }: any) => {
  const fromDate = useInput(today);
  //const classes = useStyles();
  const [mrpDataList, setMrpDataList] = useState(MrpSimulatorList);
  const [gridApi, setGridApi] = useState(null);
  console.log(mrpDataList);

  useEffect(() => {
    console.log('checkData : ', checkData);
    const size = checkData.length;
    for (let a = 0; a < size; a++) {
      var mpsNo = checkData[a].mpsNo; //mpsNo가 ????
    }
    console.log('mpsNo : ', mpsNo);
    searchMrpList({ mpsNoListStr: mpsNo });
    // searchMrpList(mpsNo);
    setCheckData(null);
  }, []);

  const onClickMrpInsert = () => {
    gridApi.selectAll();
    var selectedData = gridApi.getSelectedRows();

    MrpRegisterList({ mrpRegisterDate: fromDate.value, batchList: MrpSimulatorList });

    console.log(selectedData);

    gridApi.updateRowData({ remove: selectedData });

    mrpRegisterGridApi.setRowData([]);
  };

  const Grind = (prams: any) => {
    setGridApi(prams.api);
  };

  return (
    <>
      <MyGrid column={mrpListColumn} title={'MRP  SIMULATION'} list={MrpSimulatorList} api={Grind}>
        <div id="grid-wrapper">
          <TextField
            id={'fromDate'}
            label={'소요량 전개일자'}
            type={'date'}
            defaultValue={fromDate.value}
            onChange={fromDate.onChange}
            // className={classes.textField}
            variant="outlined"
          />
          <Button variant="contained" color="primary" style={{ marginRight: '1vh', marginTop: '2vh' }} onClick={onClickMrpInsert}>
            전개 결과 MRP등록
          </Button>
        </div>
      </MyGrid>
    </>
  );
};

export default Mrpdialog;
