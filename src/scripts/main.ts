/*=====================================================================================
Import classes
=======================================================================================*/

import { Caliber } from './classes/Caliber'
import { Item } from './classes/Item'

/*=====================================================================================
Create important objects
=======================================================================================*/

const Calibers = [
   new Caliber('762x39', '7.62x39mm'),
   new Caliber('9x19', '9x19mm')
];

const itemData = [
   {
      name: 'ammobox_762x39',
      label: 'Box of 7.62x39mm',
      flavor_text: 'Lorem ipsum dolor sit amet',
      type: "AmmoContainer",
      sprite_y: 0,
      sprite_x: 0,
      caliber: Calibers.find(item => item.name == '762x39'),
      capacity: 60
   },
   {
      name: 'ammobox_9x19',
      label: 'Box of 9x19mm',
      flavor_text: 'Lorem ipsum dolor sit amet',
      type: "AmmoContainer",
      sprite_y: 1,
      sprite_x: 0,
      caliber: Calibers.find(item => item.name == '9x19'),
      capacity: 30
   },
   {
      name: 'mag_s_762x39',
      label: 'Magazine (s)',
      flavor_text: 'A small magazine',
      type: "MagClip",
      sprite_y: 0,
      sprite_x: 2,
      caliber: Calibers.find(item => item.name == '762x39'),
      capacity: 7
   },
   {
      name: 'mag_m_762x39',
      label: 'Magazine (m)',
      flavor_text: 'A magazine',
      type: "MagClip",
      sprite_y: 0,
      sprite_x: 1,
      caliber: Calibers.find(item => item.name == '762x39'),
      capacity: 19
   },
   {
      name: 'mag_xl_762x39',
      label: 'Magazine (xl)',
      flavor_text: 'A drum magazine',
      type: "MagClip",
      sprite_y: 0,
      sprite_x: 3,
      caliber: Calibers.find(item => item.name == '762x39'),
      capacity: 39
   },
   {
      name: 'mag_9x19',
      label: 'Pistol magazine',
      flavor_text: 'A pistol magazine',
      type: "MagClip",
      sprite_y: 1,
      sprite_x: 1,
      caliber: Calibers.find(item => item.name == '9x19'),
      capacity: 9
   }
];

const Items = itemData.map((data) => new Item(
   data.name,
   data.label,
   data.flavor_text,
   data.type,
   data.sprite_y,
   data.sprite_x,
   data.caliber,
   data.capacity
));

const Inventory = {
   x: 5,
   y: 3,
   cells: [
      // Example
      // {
      //    item_id: 1,
      //    item_name: 'ammobox_762x39'
      // }
   ]
};

/*=====================================================================================
Global variables
=======================================================================================*/

const sprite_size: number = (20 * 4);

/*=====================================================================================
Debug stuff
=======================================================================================*/

function updateDebugInfo() {
   const debug_el: HTMLElement = document.querySelector('.info-cells');
   debug_el.innerHTML = JSON.stringify(Items, null, 4);
}

/*=====================================================================================
inventoryInit()
=======================================================================================*/

function inventoryInit(): void {
   const inv_container: Element = document.querySelector('.inventory__container');

   if (!inv_container) return;

   const inv_Y: number = Inventory.y;
   const inv_X: number = Inventory.x;
   const inv_cell_amount: number = (inv_Y * inv_X);

   for (let i = 0; i < inv_cell_amount; i++) {
      const temp_cell: Element = document.createElement('div');
      temp_cell.classList.add('inventory__cell');
      temp_cell.setAttribute('cell-id', i.toString());

      inv_container.appendChild(temp_cell);
   }

   // ===== Set grid column count =====
   let grid_template_columns_value: string = '';
   for (let i = 0; i < inv_X; i++) {
      grid_template_columns_value += 'auto ';
   }
   grid_template_columns_value += ';';
   inv_container.setAttribute('style', 'grid-template-columns: ' + grid_template_columns_value);

   // ===== Init MutationObserver to make sure those items have and keep their eventHandlers and stuff =====
   var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
         setDragEventHandlers();
         setTooltipEventHandlers();
         updateDebugInfo();
      });
   });

   observer.observe(inv_container, {
      attributes: true,
      childList: true
   });
}

/*=====================================================================================
Tooltipz
=======================================================================================*/

function setTooltipEventHandlers() {
   const tooltip_el: HTMLElement = document.querySelector('.tooltip');
   const inv_items: NodeListOf<Element> = document.querySelectorAll('.item');

   inv_items.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
         const target_item_el: Element = e.target;
         tooltip_el.style.opacity = '1';
      });

      item.addEventListener('mouseleave', (e) => {
         const target_item_el: Element = e.target;
         tooltip_el.style.opacity = '0';
      });
   });

}

/*=====================================================================================
Draggin'
=======================================================================================*/

function setDragEventHandlers() {

   // ===== DragStart =====

   const inv_items: NodeListOf<Element> = document.querySelectorAll('.item');

   function dragStart(e) {
      e.dataTransfer.setData('drag_el_id', e.target.getAttribute('item-id'));
   }

   inv_items.forEach(item => {
      item.addEventListener('dragstart', dragStart);
   });

   // ===== Other =====

   function dragEnter(e) {
      e.preventDefault();
      e.target.classList.add('inventory__cell--drag-hover');
   }

   function dragOver(e) {
      e.preventDefault();
      e.target.classList.add('inventory__cell--drag-hover');
   }

   function dragLeave(e) {
      e.preventDefault();
      e.target.classList.remove('inventory__cell--drag-hover');
   }

   function drop(e) {
      e.preventDefault();
      // Check if item can be dropped on cell
      const drop_el: Element = e.target;
      const drop_cell: Element = drop_el.closest('.inventory__cell');
      if (!drop_cell) return;

      drop_el.classList.remove('inventory__cell--drag-hover');

      const drop_cell_id: any = drop_cell.getAttribute('cell-id');
      if (!drop_cell_id) return;

      const drag_el_id = e.dataTransfer.getData("drag_el_id");
      if (!drag_el_id) return;

      combineItemCell(drag_el_id, drop_cell_id);
   }

   const inv_cells: NodeListOf<Element> = document.querySelectorAll('.inventory__cell');

   inv_cells.forEach(cell => {
      cell.addEventListener('dragenter', dragEnter)
      cell.addEventListener('dragover', dragOver);
      cell.addEventListener('dragleave', dragLeave);
      cell.addEventListener('drop', drop);
   });
}

/*=====================================================================================
Helper functions
=======================================================================================*/

export function combineItemCell(param_item_el_id: number, param_cell_el_id: number) {

   if (!param_item_el_id || !param_cell_el_id) return;

   const item_el: Element = getItemElementByID(param_item_el_id);
   const cell_el: Element = getCellElementByID(param_cell_el_id);


   if (!isCellOccupied(param_cell_el_id)) {
      // Not occupied, move item element here
      cell_el.appendChild(item_el);

   } else {
      // occupied, see what shit you can do with these two items
      const item_name = document.querySelector('item-name');
   }
}

function getItemElementByID(param_item_id: number): any {
   const item_element: Element = document.querySelector('[item-id="' + param_item_id + '"]');
   if (item_element === undefined) {
      console.error('Specified item element does not exist');
      return false;
   }

   return item_element;
}

function getCellElementByID(param_cell_id: number): any {
   const cell_element: Element = document.querySelector('[cell-id="' + param_cell_id + '"]');
   if (cell_element === undefined) {
      console.error('Specified cell element does not exist');
      return false;
   }

   return cell_element;
}

function getRandomInt(max) {
   return Math.floor(Math.random() * max);
}

function isCountable(param_item: Item): boolean {
   if (param_item.capacity === 0) {
      return false;
   }

   return true;
}

function isCellOccupied(param_cell_id: number): boolean {

   if (getCellElementByID(param_cell_id).childNodes.length !== 0) {
      return true;
   }

   return false;
}

function getFirstEmptyCell(): any {
   const inv_cells: NodeListOf<Element> = document.querySelectorAll('.inventory__cell');

   for (let cell: number = 0; cell < inv_cells.length; cell++) {
      if (!isCellOccupied(cell)) {
         return cell;
      }
      continue;
   }
   return false;
}

/*=====================================================================================
giveItem()
=======================================================================================*/

function giveItem(param_item_name: string, param_amount?: number, param_cell_id?: number): boolean {
   let param_item: Item = Items.find(item => item.name == param_item_name);

   if (param_item === undefined) {
      console.error('No item found with name: ' + param_item_name);
      return false;
   }

   const new_item: Element = document.createElement('div');
   new_item.classList.add('item');

   new_item.setAttribute('draggable', 'true');
   new_item.setAttribute('item-id', getRandomInt(999999999999).toString());
   new_item.setAttribute('item-name', param_item.name.toString());
   new_item.setAttribute('style', `background-position: -${param_item.sprite_x * sprite_size}px -${param_item.sprite_y * sprite_size}px`)

   // ===== Countable additions ====
   if (isCountable(param_item)) {
      if (param_amount !== undefined) {
         new_item.setAttribute('item-amount', param_amount.toString());
      } else {
         new_item.setAttribute('item-amount', param_item.capacity.toString());
      }
      new_item.classList.add('item__countable');
      new_item.setAttribute('item-capacity', param_item.capacity.toString());

      // ===== Magclip type additions ====
      if (param_item.type == "MagClip") {
         new_item.classList.add('item__magclip');
      }
   }

   let chosen_cell: number = 0;

   if (param_cell_id !== undefined) {
      if (!isCellOccupied(param_cell_id)) {
         chosen_cell = param_cell_id;

      } else {
         console.error('Cell in paramter: ' + param_cell_id + ' is already occupied, getting the next free cell');

         chosen_cell = getFirstEmptyCell();

         const inv_cells: NodeListOf<Element> = document.querySelectorAll('.inventory__cell');
         inv_cells[chosen_cell].appendChild(new_item);
         return true;
      }
   } else {
      chosen_cell = getFirstEmptyCell();

      const inv_cells: NodeListOf<Element> = document.querySelectorAll('.inventory__cell');
      inv_cells[chosen_cell].appendChild(new_item);
      return true;
   }

};

document.addEventListener('mousemove', function (e) {
   let circle: HTMLElement = document.querySelector('.tooltip');
   let left: number = e.clientX;
   let top: number = e.clientY;
   circle.style.left = (left + 15) + 'px';
   circle.style.top = top + 'px';
});

/*=====================================================================================
On OMContentLoaded
=======================================================================================*/

document.addEventListener("DOMContentLoaded", () => {
   inventoryInit();

   giveItem('ammobox_762x39', 12);
   giveItem('ammobox_9x19');
   giveItem('ammobox_9x19', 2);
   giveItem('mag_s_762x39', 7);
   giveItem('mag_m_762x39', 4);
   giveItem('mag_xl_762x39');
   giveItem('mag_9x19');

   setDragEventHandlers();
   setTooltipEventHandlers();
   updateDebugInfo();
});