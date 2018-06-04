import { injectGlobal } from 'styled-components';
import reset from 'reset-css';

const baseStyles = () => injectGlobal`
${reset}
body{
    font-family: 'Open Sans', sans-serif;
    background-color:#202326;
    color:#FFFFFF;
    font-size:16px;
}
`
export default baseStyles;

