import axios from 'axios';

const getmpsData = async (startDate: any, endDate: any, dateSearchCondition: any) => {
  const params = {
    startDate: startDate,
    endDate: endDate,
    dateSearchCondition: dateSearchCondition
  };

  const response = await axios.get('http://localhost:9102/production/mps/list', { params: params });
  let datatata = response.data.gridRowJson;
  console.log('서버에서 받은 데이터 ㅇㅅㅇ???:', response.data.gridRowJson);

  return datatata;
};

export { getmpsData };

//2023-11-07(화) Hoyeon
//Type 지정
