/*=====================================================================================
Classes
=======================================================================================*/
class inventory {
   constructor(
      public name: string,
      public x: number,
      public y: number,
   ) {
      this.name = name;
      this.x = x;
      this.y = y;
   }
}
class item {
   constructor(
      public id: number,
      public type: string,
      public max_amount: number,
      public name: string,
      public label: string,
      public sprite_y: number,
      public sprite_x: number,
   ) {
      this.id = id;
      this.type = type;
      this.max_amount = max_amount;
      this.name = name;
      this.label = label;
      this.sprite_y = sprite_y;
      this.sprite_x = sprite_x;
   }
}

/*=====================================================================================
The Game Object
=======================================================================================*/

const game = {
   inventory: new inventory('default', 10, 5),
   items: [
      new item(0, 'ammo', 60, 'ammo_762x39', '7.62x39mm', 0, 0),
      new item(1, 'ammo', 30, 'ammo_9x19', '9x19mm', 1, 0),
      new item(2, 'magclip', 30, 'magclip_762x39', '', 0, 1),
      new item(3, 'magclip', 9, 'magclip_9x19', '', 1, 1)
   ],
}

/*=====================================================================================
Global variables
=======================================================================================*/

const sprite_size: number = (20 * 4);

/*=====================================================================================
inventoryInit()
=======================================================================================*/

function inventoryInit(): void {
   const inv_container: Element = document.getElementsByClassName('inventory__container')[0];
   const inv_Y: number = game.inventory.y;
   const inv_X: number = game.inventory.x;

   if (inv_container === undefined) {
      return;
   }

   let cell_nr = 0;
   for (let row_nr = 0; row_nr < inv_Y; row_nr++) {
      const temp_row: Element = document.createElement('div');
      temp_row.classList.add('inventory__row');
      temp_row.setAttribute('row_id', row_nr.toString());

      const new_row: Element = inv_container.appendChild(temp_row);
      for (let i = 0; i < inv_X; i++) {
         const temp_cell: Element = document.createElement('div');
         temp_cell.classList.add('inventory__cell');
         temp_cell.setAttribute('cell_id', cell_nr.toString());

         new_row.appendChild(temp_cell);

         cell_nr++;
      }
   }
}

/*=====================================================================================
Helper functions
=======================================================================================*/

function isCountable(param_item: item): boolean {
   if (game.items[param_item.id].max_amount === 0) {
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
   const inv_cells: HTMLCollectionOf<Element> = document.getElementsByClassName('inventory__cell');
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

function giveItem(param_item_id: number, param_amount?: number, param_cell_id?: number): boolean {
   let item: item = game.items[param_item_id];
   if (item === undefined) {
      console.error('No item found with id: ' + param_item_id);
      return false;
   }

   const new_item: Element = document.createElement('div');
   new_item.classList.add('item');
   new_item.setAttribute('item_id', item.id.toString());
   new_item.setAttribute('style', `background-position: -${game.items[param_item_id].sprite_x * sprite_size}px -${game.items[param_item_id].sprite_y * sprite_size}px`)

   if (game.items[param_item_id].label !== '') {
      const new_item_label: Element = document.createElement('span');
      new_item_label.classList.add('item__label');
      new_item_label.innerHTML = game.items[param_item_id].label;

      new_item.appendChild(new_item_label);
   }

   // ===== Countable additions ====
   if (isCountable(game.items[param_item_id])) {
      if (param_amount !== undefined) {
         new_item.setAttribute('item_amount', param_amount.toString());
      } else {
         new_item.setAttribute('item_amount', game.items[param_item_id].max_amount.toString());
      }
      new_item.classList.add('item__countable');
      new_item.setAttribute('item_max_amount', game.items[param_item_id].max_amount.toString());

      // ===== Magclip type additions ====
      if (game.items[param_item_id].type == 'magclip') {
         new_item.classList.add('item__magclip');
      }
   }

   let chosen_cell: number = 0;
   if (param_cell_id !== undefined && !isCellOccupied(param_cell_id)) {
      chosen_cell = param_cell_id;
   } else {
      if (param_cell_id !== undefined) {
         console.error('Cell in paramter:' + param_cell_id + ' is already occupied, getting the next free cell');
      }

      chosen_cell = getFirstEmptyCell();

      const inv_cells: HTMLCollectionOf<Element> = document.getElementsByClassName('inventory__cell');
      inv_cells[chosen_cell].appendChild(new_item);
      return true;
   }
};

/*=====================================================================================
DOMContentLoaded
=======================================================================================*/

document.addEventListener("DOMContentLoaded", () => {
   inventoryInit();

   // Test fill
   giveItem(1, 12);
   giveItem(3, 3);
   giveItem(2, 8);
   giveItem(0, 4);
   giveItem(1);
   giveItem(3);
   giveItem(0);
});
