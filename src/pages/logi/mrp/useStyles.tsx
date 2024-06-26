import { makeStyles } from '@mui/material/styles';

//2023-10-20(금) : Hoyeon
//mrp에 적용하기 위한 useStyles 파일 생성
const usestyles = makeStyles((theme: any) => ({
  mainPaper: {
    padding: theme.spacing(3),
    height: 750,
    background: 'white'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
    paddingTop: 5,
    margin: 8
  },
  searchTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
    paddingTop: 5,
    margin: 8
  },
  searchButton: {
    margin: 20,
    marginLeft: theme.spacing(2),
    paddingTop: 6
  },
  whiteButton: {
    margin: 20,
    paddingTop: 6,
    marginLeft: theme.spacing(2),
    color: 'white'
  },
  button: {
    alignItems: 'baseline',
    margin: 10
  },
  subCategory: {
    background: '#232f3e',
    color: 'white'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  topFormControl: {
    margin: theme.spacing(1),
    minWidth: 300
  },
  radio: {
    marginLeft: theme.spacing(2)
  }
}));

export default usestyles;
