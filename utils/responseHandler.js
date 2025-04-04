const successResponse = (res, data = null, message, status, statusCode = 200 ) => {
    if (data && data.data) {
        return res.status(statusCode).json({
            status,
            success: true,
            message,
            ...data 
        });
    } else {
        return res.status(statusCode).json({
            status,
            success: true,
            message,
            data
        });
    }
};

const errorResponse = (res, message = 'Error', error = null, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};

const paginateData = async (model, query, page = 1, perPage = 10, populateFields = [], sort = { createdAt  : -1 }) => {
    try {
        const pageNumber = Math.max(parseInt(page, 10), 1);
        const perPageNumber = Math.max(parseInt(perPage, 10), 1);

        const totalRecords = await model.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / perPageNumber);

        let queryBuilder = model.find(query).sort(sort).skip((pageNumber - 1) * perPageNumber).limit(perPageNumber);
        if (populateFields.length > 0) {
            populateFields.forEach(field => {
                queryBuilder = queryBuilder.populate(field);
            });
        }
        const data = await queryBuilder;

        const rangeFrom = totalRecords > 0 ? (pageNumber - 1) * perPageNumber + 1 : 0;
        const rangeTo = totalRecords > 0 ? Math.min(pageNumber * perPageNumber, totalRecords) : 0;

        const dataWithSno = data.map((item, index) => ({
            ...item.toObject(),
            sno: rangeFrom + index
        }));

        const pagination = {
            total_records: totalRecords || 0,
            total_pages: totalPages || 0,
            current_page: pageNumber,
            per_page: perPageNumber,
            range_from: rangeFrom,
            range_to: rangeTo,
            next_page: pageNumber < totalPages ? pageNumber + 1 : null,
            prev_page: pageNumber > 1 ? pageNumber - 1 : null
        };

        return { data: dataWithSno, pagination };
    } catch (error) {
        console.error("Error in paginateData:", error.message);
        throw new Error(`Pagination Error: ${error.message}`);
    }
};

module.exports = { successResponse, errorResponse ,paginateData };
