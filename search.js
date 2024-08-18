const searchTerm = "abhi";
    try {
        const results = await Document.findAll({
            where: {
                [Op.or]: [
                    {
                        file_name: {
                            [Op.like]: `%${searchTerm}%`
                        }
                    },
                    {
                        path: {
                            [Op.like]: `%${searchTerm}%`
                        }
                    },
                    sequelize.where(
                        sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_SEARCH', sequelize.col('custom_fields_data'), 'one', `%${searchTerm}%`)),
                        {
                            [Op.not]: null
                        }
                    )
                ]
            }
        });