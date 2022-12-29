
class APIFeatures{
    constructor(public query: any, public queryString: any) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() { 
        const queryObj = { ...this.queryString};
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
            let sortBy = this.queryString.sort as string;
            this.query=this.query.sort(sortBy.split(',').join(' '));
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }
    limitFields() { 
        //field limiting
        if (this.queryString.fields) { 
            const fields = this.queryString.fields as string;
            this.query = this.query.select(fields.split(',').join(' '));
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() { 
        //pagination
        const page: number = parseInt(this.queryString.page as string) || 1;
        const limit: number = parseInt(this.queryString.limit as string) || 10
        const skip: number = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

        
}

export default APIFeatures;