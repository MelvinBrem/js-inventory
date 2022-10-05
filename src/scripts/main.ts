// Global variables
const sprite_size :number = (20 * 4);

// Initializing classes
class inventory {
   constructor(
      public name: string,
      public x:   number,
      public y: number,
      ){
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
   ){
      this.id = id;
      this.type = type;
      this.max_amount = max_amount;
      this.name = name;
      this.label = label;
      this.sprite_y = sprite_y;
      this.sprite_x = sprite_x;
   }
}

// Initializing game object
const game = {
   inventory: new inventory('default', 10, 5),
   items: [
      new item(0, 'ammo', 60, 'ammo_762x39', '7.62x39mm', 0, 0),
      new item(1, 'ammo', 30, 'ammo_9x19', '9x19mm', 1, 0),
      new item(2, 'magclip', 0, 'magclip_762x39', '', 0, 1),
      new item(3, 'magclip', 0, 'magclip_9x19', '', 1, 1)
   ],
}

function throw_error(parameters: IArguments, error_message: string){
   console.error(`Error: ${throw_error.caller.name}(): ` + error_message);
}

// Check if an item can have an "amount"
function isCountable(item: item){
   if(game.items[item.id].max_amount !== 0){
      return true;
   }

   return false;
}

// Check if cell is occupied
function isCellOccupied(cell: number){
   const inv_cells: HTMLCollectionOf<Element> = document.getElementsByClassName('inventory__cell');
   
   if(inv_cells[cell].childNodes.length !== 0){
      return true;
   }

   return false;
}

// Create an item
function giveItem(param_item_id: number, param_amount?: number, param_cell?: number){
   const inv_cells: HTMLCollectionOf<Element> = document.getElementsByClassName('inventory__cell');
   let item = game.items[param_item_id];

   // If cell exists in inventory
   if(param_cell < 0 || param_cell >= inv_cells.length){
      throw_error(arguments, `Specified cell does not exist`);
      return;
   }

   // If item exists in game
   if(item === undefined){
     throw_error(arguments, 'No item found with id: ' + param_item_id);
     return;
   }

   // Generate the new item   
   const new_item : Element = document.createElement('div');
   new_item.setAttribute('class', 'item');
   new_item.setAttribute('item_id', item.id.toString());
   new_item.setAttribute('style', `background-position: -${game.items[param_item_id].sprite_x * sprite_size}px -${game.items[param_item_id].sprite_y * sprite_size}px`)

   // Amount attribute
   if(isCountable(game.items[param_item_id])){
      if(param_amount !== undefined){
         new_item.setAttribute('item_amount', param_amount.toString());
      } else {
         new_item.setAttribute('item_amount', game.items[param_item_id].max_amount.toString());
      }
   }
   // Label
   if(game.items[param_item_id].label !== ''){
      const new_item_label : Element = document.createElement('span');
      new_item_label.setAttribute('class', 'item__label');
      new_item_label.innerHTML = game.items[param_item_id].label;

      new_item.appendChild(new_item_label);
   }

   // Counter
   if(isCountable(game.items[param_item_id])){
      const new_item_counter : Element = document.createElement('span');
      new_item_counter.setAttribute('class', 'item__counter');

      new_item.appendChild(new_item_counter);
   }

   // Determine where the item will be placed
   let target_cell: number;

   if(param_cell !== undefined && !isCellOccupied(param_cell)){
      target_cell = param_cell;
   } else {
      throw_error(arguments, 'amount parameter given, but item not countable');
      
      for(let cell = 0; cell < inv_cells.length; cell++){
         if(isCellOccupied(cell)){
            continue;
         }
            
         target_cell = cell;
         break;
      }
   }
      
   // If target cell is defined
   if(target_cell === undefined){
      throw_error(arguments, `Target cell "${target_cell}" does not exist`);
      return;
   }

   inv_cells[target_cell].appendChild(new_item);
};

// Initializing the inventory
function inventoryInit() {
   const inv_Y : number = game.inventory.y;
   const inv_X : number = game.inventory.x;

   const inv_container : Element = document.getElementsByClassName('inventory__container')[0];

   if(inv_container === undefined){
      return;
   }

   let cell_nr = 0;

   for (let row_nr = 0; row_nr < inv_Y; row_nr++){
      const temp_row : Element = document.createElement('div');
      temp_row.setAttribute('class', 'inventory__row');
      temp_row.setAttribute('row_id', row_nr.toString());

      const new_row : Element = inv_container.appendChild(temp_row);
      
      for(let i = 0; i < inv_X; i++){
         const temp_cell : Element = document.createElement('div');
         temp_cell.setAttribute('class', 'inventory__cell');
         temp_cell.setAttribute('cell_id', cell_nr.toString());

         new_row.appendChild(temp_cell);

         cell_nr++;
      }
   }
}

// Apply the inventory configuration to the inventory object
document.addEventListener("DOMContentLoaded", () => {
   inventoryInit();

   // Test fill
   giveItem(1, 2, 1);
   giveItem(3, 0, 1);
   giveItem(0, 2, 2);
   giveItem(2, 0, 3);
});
