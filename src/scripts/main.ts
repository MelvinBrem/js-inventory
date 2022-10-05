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
      public max_amount: number, // 0 if item is not countable
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
      new item(2, 'magclip', 0, 'magclip_762x39', '', 0, 1),
      new item(3, 'magclip', 0, 'magclip_9x19', '', 1, 1)
   ],
}

/*=====================================================================================
Helper functions
=======================================================================================*/

function throw_error(parameters: IArguments, error_message: string) {
   console.error(`Error: ${throw_error.caller.name}(): ` + error_message);
}

function isCountable(param_item: item) {
   if (game.items[param_item.id].max_amount !== 0) {
      return true;
   }

   return false;
}

function getCell(param_cell_id: number): Element {
   const inv_cells: HTMLCollectionOf<Element> = document.getElementsByClassName('inventory__cell');

   if (param_cell_id >= inv_cells.length) {
      throw_error(arguments, `Specified cell does not exist`);
      return;
   }

   const cell_elemnt: Element = document.querySelector('[cell_id="' + param_cell_id + '"]');
   return cell_elemnt;
}

function isCellOccupied(param_cell_id: number): boolean {
   const inv_cells: HTMLCollectionOf<Element> = document.getElementsByClassName('inventory__cell');

   if (getCell(param_cell_id).childNodes.length !== 0) { // =============== Fix this dumbass
      return true;
   }

   return false;
}

/*=====================================================================================
Global variables
=======================================================================================*/

const sprite_size: number = (20 * 4);

/*=====================================================================================
inventoryInit()
=======================================================================================*/

function inventoryInit() {
   const inv_Y: number = game.inventory.y;
   const inv_X: number = game.inventory.x;

   const inv_container: Element = document.getElementsByClassName('inventory__container')[0];

   if (inv_container === undefined) {
      return;
   }

   let cell_nr = 0;

   for (let row_nr = 0; row_nr < inv_Y; row_nr++) {
      const temp_row: Element = document.createElement('div');
      temp_row.setAttribute('class', 'inventory__row');
      temp_row.setAttribute('row_id', row_nr.toString());

      const new_row: Element = inv_container.appendChild(temp_row);

      for (let i = 0; i < inv_X; i++) {
         const temp_cell: Element = document.createElement('div');
         temp_cell.setAttribute('class', 'inventory__cell');
         temp_cell.setAttribute('cell_id', cell_nr.toString());

         new_row.appendChild(temp_cell);

         cell_nr++;
      }
   }
}

/*=====================================================================================
giveItem()
=======================================================================================*/

function giveItem(param_item_id: number, param_amount?: number, param_cell_id?: number): Boolean {
   let item = game.items[param_item_id];

   if (item === undefined) {
      throw_error(arguments, 'No item found with id: ' + param_item_id);
      return false;
   }

   const new_item: Element = document.createElement('div');
   new_item.setAttribute('class', 'item');
   new_item.setAttribute('item_id', item.id.toString());
   new_item.setAttribute('style', `background-position: -${game.items[param_item_id].sprite_x * sprite_size}px -${game.items[param_item_id].sprite_y * sprite_size}px`)

   if (param_amount !== 0 && isCountable(game.items[param_item_id])) {
      if (param_amount !== undefined) {
         new_item.setAttribute('item_amount', param_amount.toString());
      } else {
         new_item.setAttribute('item_amount', game.items[param_item_id].max_amount.toString());
      }
   }
   if (game.items[param_item_id].label !== '') {
      const new_item_label: Element = document.createElement('span');
      new_item_label.setAttribute('class', 'item__label');
      new_item_label.innerHTML = game.items[param_item_id].label;

      new_item.appendChild(new_item_label);
   }
   if (isCountable(game.items[param_item_id])) {
      new_item.setAttribute('class', 'item item__countable');
   }

   // Determine where the item will be placed
   const inv_cells: HTMLCollectionOf<Element> = document.getElementsByClassName('inventory__cell');

   let target_cell: number = 0;

   if (param_cell_id !== undefined && !isCellOccupied(param_cell_id)) {
      target_cell = param_cell_id;
   } else {

      if (param_cell_id !== undefined) {
         throw_error(arguments, 'Cell in paramter is already occupied, getting the next free cell');
      }

      for (let cell = 0; cell < inv_cells.length; cell++) {
         if (!isCellOccupied(cell)) {
            target_cell = cell;
            break;
         }

         continue;
      }
   }

   if (target_cell === undefined) {
      throw_error(arguments, `Target cell is not defined`);
      return false;
   }

   inv_cells[target_cell].appendChild(new_item);
   return true;
};


/*=====================================================================================
DOMContentLoaded
=======================================================================================*/

document.addEventListener("DOMContentLoaded", () => {
   inventoryInit();

   // Test fill
   giveItem(1);
   giveItem(3);
   giveItem(2);
   giveItem(0);
   giveItem(1);
   giveItem(3);
   giveItem(0);
});
