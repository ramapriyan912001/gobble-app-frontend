import {styles} from './RegisterStyles'

const light = '#ffe';
const dark = '#242C40';

class Themes {
    constructor() {}
    oppositeTheme = isLight => isLight ? dark : light;
    containerTheme = isLight => isLight ? styles.lightContainer: styles.darkContainer;
    textTheme = isLight => isLight ? styles.darkText : styles.lightText;
    oppositeTextTheme = isLight => isLight ? styles.lightText : styles.darkText;
    viewTheme = isLight => isLight ? styles.lightInput : styles.darkInput;
    buttonTheme = isLight => isLight ? styles.darkButton : styles.lightButton;
}

const themes = new Themes();
export default themes;