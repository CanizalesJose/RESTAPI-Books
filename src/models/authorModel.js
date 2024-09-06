class Author{
    constructor(){
        this.id = null;
        this.name = null;
    }

    initModel(data){
        this.id = data.id;
        this.name = data.name;
    }

    getId(){
        return this.id;
    }
    setId(id){
        this.id = id;
    }

    getName(){
        return this.name;
    }
    setName(name){
        this.name = name;
    }
}

module.exports = Author;