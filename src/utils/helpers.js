const formatCurrency = (amount) => {
    return Number(amount).toFixed(2);
};

const buildPaginationMeta = (page, limit, total) => {
    return {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
    };
};

module.exports = {
    formatCurrency,
    buildPaginationMeta
};