class maxStack{
    constructor(limit){
        this.items = [];
        this.maxItems = limit ?? 0;
    }

    push(item){
        if(this.isFull()) {
          this.popBottom();
        }
        this.items.push(item);
    }

    isFull(){
        return this.maxItems == 0 ? false : this.items.length >= this.maxItems;
    }

    pop(){
        return this.items.pop();
    }

    popBottom(){
        return this.items.shift();
    }

    isEmpty(){
        return this.items.length == 0;
    }
}