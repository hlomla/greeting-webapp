const assert = require("assert");
const greetings = require("../greetings")
const pg = require("pg");
const Pool = pg.Pool;


let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/my_database';


const pool = new Pool({
    connectionString,
    ssl:{ rejectUnauthorized: false}    
  });

const greeted = new greetings(pool)

describe('Greetings', function () {
    beforeEach(async function () {
        try {
            await pool.query("delete from usergreet"); 
        } catch (error) {
            console.log('**********')
        }
    })
    describe('Return greetings in language selected', function () {
        it('should be able to return greetings in isiXhosa and return a name', async function () {
            let greeted = greetings();

            await greeted.languageSelected('lang', 'name')

            assert.equal('Molo, Hlomla', await greeted.languageSelected('isiXhosa', 'Hlomla'))
        });
        it('should be able to return greetings in English and return a name', async function () {
            let greeted = greetings();

            await greeted.languageSelected('lang', 'name')

            assert.equal('Hello, Okuhle', await greeted.languageSelected('English', 'Okuhle'))
        });
        it('should be able to return greetings in Greek and return a name', async function () {
            let greeted = greetings();

            await greeted.languageSelected('lang', 'name')

            assert.equal('Geia, Busi', await greeted.languageSelected('Greek', 'Busi'))
        });
    });
    describe('Return how many users were greeted', function () {
        it('should be able to return counter when one person was greeted', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Freddy')

            await greeted.languageSelected('isiXhosa', 'Freddy');

            assert.equal(1, await greeted.allUser())
        })
        it('should be able to return counter when one person is greeted twice', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Freddy')
            await greeted.insertNames('Freddy')

            await greeted.languageSelected('isiXhosa', 'Freddy');
            await greeted.languageSelected('English', 'Freddy');

            assert.equal(1, await greeted.allUser())
        })
        it('should be able to return counter when different users are greeted', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Hlomla')
            await greeted.insertNames('Freddy')
            await greeted.insertNames('Fred')

            await greeted.languageSelected('isiXhosa', 'Freddy');
            await greeted.languageSelected('English', 'Fred');
            await greeted.languageSelected('Greek', 'Hlomla');

            assert.equal(3, await greeted.allUser())
        })
    });
    describe('Return the list of people greeted', function () {
        it('should be able to return the list of people greeted', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Hlomla');
            await greeted.insertNames('Sam');
            await greeted.insertNames('Freddy');

            let rawNameArr = await greeted.getNameList(['Hlomla', 'Freddy', 'Sam']);
            let isoNameArr = [];

            for (let i = 0; i < rawNameArr.length; i++) {
                isoNameArr[i] = rawNameArr[i].names;
            }

            assert.deepEqual(isoNameArr, ['Freddy', 'Hlomla', 'Sam']);

        });
        it('should be able to return the list of people greeted when one person is greeted twice', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Hlomla');
            await greeted.insertNames('Freddy');
            await greeted.insertNames('Freddy');

            let rawNameArr = await greeted.getNameList(['Hlomla', 'Freddy']);
            let isoNameArr = [];

            for (let i = 0; i < rawNameArr.length; i++) {
                isoNameArr[i] = rawNameArr[i].names;
            }

            assert.deepEqual(isoNameArr, ['Freddy', 'Hlomla']);

        });
    })
    describe('Return how many times a user was greeted', function () {
        it('should be able to return the how many times a person got greeted', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Hlomla');
            await greeted.insertNames('Hlomla');
            await greeted.insertNames('Hlomla');

            await greeted.languageSelected('isiXhosa', 'Hlomla');
            await greeted.languageSelected('English', 'Hlomla');
            await greeted.languageSelected('Greek', 'Hlomla');
            
            let rawNameArr = await greeted.getNameList(['Hlomla']);
            let isoNameArr = [];

            for (let i = 0; i < rawNameArr.length; i++) {
                isoNameArr[i] = rawNameArr[i].counts;
            }

            assert.equal(isoNameArr, 3)
        });
        it('should be able to return the how many times a person got greeted', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Okuhle');
            await greeted.insertNames('Okuhle');
            

            await greeted.languageSelected('isiXhosa', 'Okuhle');
            await greeted.languageSelected('English', 'Okuhle');
            
            
            let rawNameArr = await greeted.getNameList(['Okuhle']);
            let isoNameArr = [];

            for (let i = 0; i < rawNameArr.length; i++) {
                isoNameArr[i] = rawNameArr[i].counts;
            }

            assert.equal(isoNameArr, 2)
        });
        it('should be able to return the how many times a person got greeted', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Xabiso');
            await greeted.insertNames('Xabiso');
            await greeted.insertNames('Xabiso');
            await greeted.insertNames('Xabiso');
            

            await greeted.languageSelected('isiXhosa', 'Xabiso');
            await greeted.languageSelected('English', 'Xabiso');
            await greeted.languageSelected('isiXhosa', 'Xabiso');
            await greeted.languageSelected('Greek', 'Xabiso');
            
            
            let rawNameArr = await greeted.getNameList(['Xabiso']);
            let isoNameArr = [];

            for (let i = 0; i < rawNameArr.length; i++) {
                isoNameArr[i] = rawNameArr[i].counts;
            }

            assert.equal(isoNameArr, 4)
        });
    });

    after(function () {
        pool.end();
    })
})




