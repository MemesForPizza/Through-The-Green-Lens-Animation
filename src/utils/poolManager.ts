import { range, useLogger } from "@motion-canvas/core"

export interface PooledObject<T> {
    obj: T,
    id: number
}

export class PoolManager<T>{
    private reserveList: Array<PooledObject<T>>
    private activeCount: number
    private reserveCount: number
    private lastID: number
    public pooledClassName: string | undefined
    constructor(
        reserve: number,
        private createObject: () => T,
        private resetObject: (obj: T) => void,
        public log: boolean = false
    ){
        this.reserveList = new Array<PooledObject<T>>()
        this.activeCount = 0
        this.reserveCount = 0
        this.lastID = 0
        this.initialize(reserve)
    }

    private initialize(count: number){
        const obj = this.fill(count)
        this.pooledClassName = obj[0].obj?.constructor?.name
        if(this.log)useLogger().info(`Pool initialized with ${this.reserveCount} object of class ${this.pooledClassName}`)
    }

    private getID(){
        return this.lastID++
    }

    private fill(count: number){
        const o = range(count).map(() => {
            const obj = this.createObject()
            this.resetObject(obj)
            const pooledObj: PooledObject<T> = {
                id: this.getID(),
                obj: obj
            }
            this.reserveList.push(pooledObj)
            this.reserveCount++
            return pooledObj
        })
        if(this.log)useLogger().info(`Pool filled with ${range(count).length} additional object(s). ${this.reserveCount} reserved, ${this.activeCount} active.`)
        return o    }

    public allocate(): PooledObject<T> {
        if(this.reserveCount < 1){
            this.fill(1)
        }

        const pooledObj = this.reserveList.shift()
        this.reserveCount--
        this.activeCount++
        if(this.log)useLogger().info(`Object ${pooledObj.id} allocated from pool. ${this.reserveCount} reserved, ${this.activeCount} active.`)
        return pooledObj
    }

    public release(pooledObj: PooledObject<T>) {
        this.resetObject(pooledObj.obj)
        this.reserveList.push(pooledObj)
        this.reserveCount++
        this.activeCount--
        if(this.log)useLogger().info(`Object ${pooledObj.id} returned to pool. ${this.reserveCount} reserved, ${this.activeCount} active.`)
    }
}