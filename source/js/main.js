import {forEachPolyfill} from './utils/polyfill-foreach';
import {initIe11Download} from './utils/init-ie11-download';
import {modules} from './modules/modules';
import {lazyLoading} from './modules/lazy-loading';

// Utils
// ---------------------------------
forEachPolyfill();
initIe11Download();


// Modules
// ---------------------------------
modules();
lazyLoading();
