"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = Object.assign({}, this.queryString);
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        //advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        //sorting 
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort;
            this.query = this.query.sort(sortBy.split(',').join(' '));
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields() {
        //field limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields;
            this.query = this.query.select(fields.split(',').join(' '));
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() {
        //pagination
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
exports.default = APIFeatures;
