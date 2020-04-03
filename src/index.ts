import on, { emit, once } from '@mmstudio/on';
import Selectr, { IData } from 'mobius1-selectr';

const no = 'mm-000003';

const styles = `
<style>
:host {
	display:block;
}
</style>`;
const tpl = `
${styles}
<select id='fd-w000018-mySelect'>
	<slot id='fd-w000018-slot' ></slot>
</select>
`;

export type IDa = IDb | string;

export interface IDb {
	[field: string]: string | number | boolean | null | undefined;
}

interface SingleSelected {
	text: string;
	value: string;
}

interface MultiSelected {
	values: SingleSelected[];
}

type Selected = SingleSelected | MultiSelected;


export default class DropdownSelect extends HTMLElement {
	private dom: ShadowRoot;
	private selector!: Selectr;
	// private children_node: Element[];
	public constructor() {
		super();
		const dom = this.dom = this.attachShadow({ mode: 'closed' });
		dom.innerHTML = tpl;
		/**
		 * slot.assignedElements 谷歌浏览器版本65一下不支持 详细可见[https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedElements]
		 */
		// const slot = dom.querySelector('#fd-w000018-slot') as HTMLSlotElement;
		// this.children_node = (() => {
		// 	if (slot.assignedElements) {
		// 		return slot.assignedElements().filter((item) => {
		// 			return item.localName === 'option' || item.localName === 'optgroup';
		// 		});
		// 	} else {
		// 		return [];
		// 	}
		// })();
		// this.children_node = Array.from(this.children) as Element[];
		// this.innerHTML = tpl;
		this.initialize();
	}
	public open() {
		this.selector.open();
	}
	public close() {
		this.selector.close();
	}
	public disable() {
		this.selector.disable();
	}
	public enable() {
		this.selector.enable();
	}
	public async render() {
		// this.selector.render();
	}
	public set_data(data: IData | IData[]) {
		this.selector.removeAll();
		this.add_data(data);
	}
	public get_all_selected() {
		const selected = this.selector.getValue(true) as Selected;
		if (selected && (selected as MultiSelected).values) {
			return (selected as MultiSelected).values;
		}
		return [selected as SingleSelected];

	}

	public set_selected(value: string) {
		const old = this.get_all_selected();
		if (old.length === 1 && old[0] && old[0].value === value) {
			// 如果原来选中,再次调用选中时会取消选中
			return;
		}
		this.selector.setValue(value);
	}
	public add_data(data: IData | IData[]) {
		this.selector.add(data);
	}

	private del_data(data: IDa[]) {
		const text_field = this.getAttribute('text-field') || 'text';
		const value_field = this.getAttribute('value-field') || 'value';

		const optgroup_text_field = this.getAttribute('optgroup-text-field') || 'text';
		const optgroup_value_field = this.getAttribute('optgroup-value-field') || 'value';
		return data.map((item) => {
			if (typeof item === 'string') {
				return {
					text: item,
					value: item
				} as IData;
			}
			const children = ((item.children ? item.children : []) as IDb[]).map((item1) => {
				return {
					disabled: item1.disabled ? item1.disabled : false,
					selected: item1.selected ? item1.selected : false,
					text: item1[optgroup_text_field],
					value: item1[optgroup_value_field] ? item1[optgroup_value_field] : item1[optgroup_text_field]
				} as IData;
			});
			return {
				children,
				disabled: item.disabled ? item.disabled : false,
				selected: item.selected ? item.selected : false,
				text: item[text_field],
				value: item[value_field] ? item[value_field] : item[text_field]
			} as IData;

		});
	}

	private initialize() {
		if (this.selector) {
			return;
		}
		const dom = this.dom;
		// 显示数据
		const data_temp = this.getAttribute('data');
		const data = (data_temp && this.del_data(JSON.parse(data_temp))) || undefined;
		// 搜索框占位符(默认值)
		const searchPlaceholder = this.getAttribute('searchPlaceholder') || '';
		// 查不到结果显示的文字
		const searchText = this.getAttribute('searchText') || '';
		// 是否为多选
		const multiple = this.hasAttribute('multiple');
		// 允许在单个选择下拉列表中取消选择值
		const allowDeselect = this.hasAttribute('allowDeselect');
		// 搜索框
		const searchable = this.hasAttribute('searchable');
		const css = document.createElement('link');
		css.setAttribute('rel', 'stylesheet');
		css.setAttribute('type', 'text/css');
		css.href = '//cdn.jsdelivr.net/npm/mobius1-selectr@2.4.13/dist/selectr.min.css';
		dom.appendChild(css);
		// 没有选择时默认显示的文本
		const placeholder = this.getAttribute('placeholder') || '请选择...';
		// 获取宽
		const select = dom.querySelector<HTMLSelectElement>('#fd-w000018-mySelect')!;
		const width = this.getAttribute('width') || this.style.width;
		if (width !== null || width !== '') {
			select.style.width = width;
		}
		if (this.children.length > 0) {
			Array.from(this.children).filter((item) => {
				return item.localName === 'option' || item.localName === 'optgroup';
			}).forEach((child) => {
				select.appendChild(child);
			});
		}
		once(css, 'load', (() => {
			this.selector = new Selectr(select, {
				allowDeselect,
				data,
				messages: {
					noResults: searchText,
					searchPlaceholder
				},
				multiple,
				placeholder,
				searchable
			});
			this.add_event_listener();
		}));
	}

	private add_event_listener() {
		this.selector.on('selectr.select', (res) => {
			emit(this, 'fdwe-select', true, true, { text: res.text, value: res.value });
		});
		this.selector.on('selectr.deselect', (res) => {
			emit(this, 'fdwe-select-deselect', true, true, { text: res.text, value: res.value });
		});
		this.selector.on('selectr.change', (res) => {
			const params = res || {};
			emit(this, 'fdwe-select-change', true, true, { text: params.text, value: params.value });
		});
		this.selector.on('selectr.open', () => {
			emit(this, 'fdwe-select-open', true, true);
		});
		this.selector.on('selectr.close', () => {
			emit(this, 'fdwe-select-close', true, true);
		});
		this.selector.on('selectr.clear', () => {
			emit(this, 'fdwe-select-clear', true, true);
		});
		this.selector.on('selectr.reset', () => {
			emit(this, 'fdwe-select-reset', true, true);
		});
		// 阻止事件冒泡,以免document上的click事件将下拉框关闭
		on(this, 'click', (e) => {
			e.stopPropagation();
		});
	}
}

if (!window.customElements.get(no)) {
	window.customElements.define(no, DropdownSelect);
}
