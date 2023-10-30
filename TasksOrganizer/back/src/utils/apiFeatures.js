export class ApiFeatures {
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
    }
    pagination = () => {
        let page = this.queryData.page
        let size = this.queryData.size
        if (page <= 0 || !page) page = 1
        if (size <= 0 || !size) size = 5
        const skip = size * (page - 1)
        this.mongooseQuery.skip(skip).limit(size)
        return this
    }

    filter = () => {
        const excluded = ['sort', 'page', 'size', 'fields', 'searchKey']
        let queryFields = { ...this.queryData }
        excluded.forEach(ele => {
            delete queryFields[ele]
        })
        queryFields = JSON.stringify(queryFields).replace(/lte|lt|gte|gt/g, (match) => {
            return `$${match}`
        })
        queryFields = JSON.parse(queryFields)
        this.mongooseQuery.find(queryFields)
        return this
    }
    sort = () => {
        if (this.queryData.sort) {
            this.mongooseQuery.sort(this.queryData.sort.replace(/,/g, ' '))
        }
        return this
    }
    search = () => {
        if (this.queryData.searchKey) {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: this.queryData.searchKey } }, { description: { $regex: this.queryData.searchKey } }
                ]
            })
        }
        return this
    }

    select = () => {
        this.mongooseQuery.select(this.queryData.fields?.replace(/,/g, ' '))
        return this
    }
}