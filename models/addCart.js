module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.description = oldCart.description || 0;
    this.price = oldCart.price || 0;

    this.add = function (item, id){
        let storedItem = this.items[id];
        console.log("storedItem: " + storedItem);
        if(!storedItem){
            storedItem = this.items[id] = {item: item, description: 0, price: 0};

            console.log("item~: " + item);

            console.log("item.enterprise: " + item.enterprise);
            console.log("item.description: " + item.description);
            console.log("item.price: " + item.price);
        }      
    };

    this.removeItem = function(id) {
        //delete this.items[id];
        delete oldCart[id];
    };

    this.generateArray = function(){
        const arr = [];
       
        for (let id in oldCart){
            arr.push(oldCart[id]);
        }
        console.log("에이알알:" + arr);
        return arr;
    };
}