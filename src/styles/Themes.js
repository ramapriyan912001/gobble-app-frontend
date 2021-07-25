import {styles} from './RegisterStyles'
import { profileStylesAddition } from './ProfileStyles';
import { MAP_DARK_MODE } from '../constants/objects';

const light = '#ffe';
const dark = '#242C40';

const lighterDark = '#2e374f';
const darkerLight = '#ededd8';
const editYellow = '#c3990b';

class Themes {
    constructor() {}
    mapTheme = isLight => isLight ? [] : MAP_DARK_MODE;
    oppositeTheme = isLight => isLight ? dark : light;
    containerTheme = isLight => isLight ? styles.lightContainer: styles.darkContainer;
    containerEditTheme = isLight => isLight ? profileStylesAddition.lightEditContainer: profileStylesAddition.darkEditContainer;
    textTheme = isLight => isLight ? styles.darkText : styles.lightText;
    oppositeTextTheme = isLight => isLight ? styles.lightText : styles.darkText;
    viewTheme = isLight => isLight ? styles.lightInput : styles.darkInput;
    buttonTheme = isLight => isLight ? styles.darkButton : styles.lightButton;
    editButtonTheme = isLight => isLight ? profileStylesAddition.darkEditButton : profileStylesAddition.lightEditButton;
    editTheme = isLight => isLight ? darkerLight : lighterDark;
    editLabelTheme = isLight => isLight ? dark : editYellow;
}

const themes = new Themes();
export default themes;