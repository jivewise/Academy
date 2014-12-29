module.exports = {
    "development": { 
		"driver":   "memory"
    },
	"devlive": { 
		"driver":   "memory"
    },
	"test": { 
		"driver":   "memory"
    },
	"production": 
	{
        driver: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'root',
        password: '',
        database: 'academy_production'
    }
};
