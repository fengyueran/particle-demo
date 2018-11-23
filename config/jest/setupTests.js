import 'raf/polyfill'; // fix warning React depends on requestAnimationFrame
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
