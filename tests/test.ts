import Widget from '../src/index';
import '../src/index';

const w1 = document.querySelector<Widget>('#w1')!;
w1.addEventListener('fdwe-select-change', (e) => {
	console.info('change event:', e);
});
const w2 = document.querySelector<Widget>('#w2')!;
const w3 = document.querySelector<Widget>('#w3')!;
const w4 = document.querySelector<Widget>('#w4')!;
const w5 = document.querySelector<Widget>('#w5')!;
const w6 = document.querySelector<Widget>('#w6')!;
const btn = document.querySelector('#btn')!;
const btn2 = document.querySelector('#btn2')!;
const btn3 = document.querySelector('#btn3')!;
btn.addEventListener('click', async () => {
	w1.set_selected('CCCCCC');
	w2.set_selected('CCCCCC');
	console.log('11111111111111 ', await w2.get_all_selected());
	console.log('get data1: ', await w1.get_all_selected());
	console.log('get data2: ', await w2.get_all_selected());
	console.log('get data3: ', await w3.get_all_selected());
	console.log('get data4: ', await w4.get_all_selected());
	console.log('get data5: ', await w5.get_all_selected());
	console.log('get data6: ', await w6.get_all_selected());
});

btn2.addEventListener('click', () => {
	w2.disable();
});

btn3.addEventListener('click', () => {
	w2.enable();
});
