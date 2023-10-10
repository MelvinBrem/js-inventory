/*=====================================================================================
Import classes
=======================================================================================*/

import { Caliber } from './classes/Caliber'
import { Item } from './classes/Item'

/*=====================================================================================
Create global objects
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

const Items = itemData.map((data) => new Item(data.name, data.label, data.flavor_text, data.type, data.sprite_y, data.sprite_x, data.caliber, data.capacity));


const Inventory = {
   x: 10,
   y: 5
};

/*=====================================================================================
Global variables
=======================================================================================*/

const sprite_size: number = (20 * 4);

/*=====================================================================================
inventoryInit()
=======================================================================================*/

function inventoryInit(): void {
   const inv_container: Element = document.querySelector('.inventory__container');

   if (!inv_container) {
      return;
   }

   const inv_Y: number = Inventory.y;
   const inv_X: number = Inventory.x;
   const inv_cell_amount: number = (inv_Y * inv_X);

   for (let i = 0; i < inv_cell_amount; i++) {
      const temp_cell: Element = document.createElement('div');
      temp_cell.classList.add('inventory__cell');
      temp_cell.setAttribute('cell_id', i.toString());

      inv_container.appendChild(temp_cell);
   }

   // ===== Set grid column count =====
   let grid_template_columns_value: string = '';
   for (let i = 0; i < inv_X; i++) {
      grid_template_columns_value += 'auto ';
   }
   grid_template_columns_value += ';';

   inv_container.setAttribute('style', 'grid-template-columns: ' + grid_template_columns_value);

   // ===== Init MutationObserver =====
   if (inv_container) {

      var observer = new MutationObserver(function (mutations) {
         mutations.forEach(function (mutation) {
            setDragEventHandlers();
         });
      });

      observer.observe(inv_container, {
         attributes: true,
         childList: true
      });

   }
}

/*=====================================================================================
Draggin' (my nuts)
=======================================================================================*/

function setDragEventHandlers() {

   function dragStart(e) {
      e.dataTransfer.setData('text/plain', e.target.id);

      setTimeout(() => {
         e.target.classList.add('item--dragging');
      }, 0);
   }

   const inv_items: NodeListOf<Element> = document.querySelectorAll('.item');

   inv_items.forEach(item => {
      item.addEventListener('dragstart', dragStart);
   });

   function dragEnter(e) {
      e.preventDefault();
      e.target.classList.add('inventory__cell--drag-hover');
   }

   function dragOver(e) {
      e.preventDefault();
      e.target.classList.add('inventory__cell--drag-hover');
   }

   function dragLeave(e) {
      e.target.classList.remove('inventory__cell--drag-hover');
   }

   function drop(e) {
      // Check if item can be dropped on cell
      const drop_node: Node = e.target;
      const drop_element: Element = e.target;

      console.log(isCellOccupied(parseInt(drop_element.getAttribute('cell_id'))));

      drop_element.classList.remove('inventory__cell--drag-hover');

      const id = e.dataTransfer.getData('text/plain');
      const currently_dragging = document.getElementById(id);

      drop_node.appendChild(currently_dragging);

      currently_dragging.classList.remove('item--dragging');
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

function getRandomInt(max) {
   return Math.floor(Math.random() * max);
}

function isCountable(param_item: Item): boolean {
   if (param_item.capacity === 0) {
      return false;
   }

   return true;
}

function getCell(param_cell_id: number): any {
   const cell_element: Element = document.querySelector('[cell_id="' + param_cell_id + '"]');
   if (cell_element === undefined) {
      console.error('Specified cell does not exist');
      return false;
   }

   return cell_element;
}

function isCellOccupied(param_cell_id: number): boolean {

   if (getCell(param_cell_id).childNodes.length !== 0) {
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
   new_item.setAttribute('item_name', param_item.name.toString());
   // Set unique id
   new_item.setAttribute('id', getRandomInt(999999999999).toString());
   new_item.setAttribute('style', `background-position: -${param_item.sprite_x * sprite_size}px -${param_item.sprite_y * sprite_size}px`)

   if (param_item.label !== '') {
      const new_item_label: Element = document.createElement('span');
      new_item_label.classList.add('item__label');
      new_item_label.innerHTML = param_item.label;

      new_item.appendChild(new_item_label);
   }

   // ===== Countable additions ====
   if (isCountable(param_item)) {
      if (param_amount !== undefined) {
         new_item.setAttribute('item_amount', param_amount.toString());
      } else {
         new_item.setAttribute('item_amount', param_item.capacity.toString());
      }
      new_item.classList.add('item__countable');
      new_item.setAttribute('item_capacity', param_item.capacity.toString());

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

/*=====================================================================================
On OMContentLoaded
=======================================================================================*/

document.addEventListener("DOMContentLoaded", () => {
   inventoryInit();

   // Test fill
   giveItem('ammobox_762x39', 12);
   giveItem('ammobox_9x19');
   giveItem('ammobox_9x19', 2);
   giveItem('mag_s_762x39', 8);
   giveItem('mag_m_762x39', 4);
   giveItem('mag_xl_762x39');
   giveItem('mag_9x19');

   setDragEventHandlers();
});