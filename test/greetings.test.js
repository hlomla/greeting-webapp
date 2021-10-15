const assert = require("assert");
const greetings = require("../greetings")
const pg = require("pg");
const { Console } = require("console");
const Pool = pg.Pool;


let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/my_database';


const pool = new Pool({
    connectionString    
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

            assert.equal('Molo, Hlomla', await greeted.languageSelected('isiXhosa', 'Hlomla'))
        });
        it('should be able to return greetings in English and return a name', async function () {
            let greeted = greetings();

            assert.equal('Hello, Okuhle', await greeted.languageSelected('English', 'Okuhle'))
        });
        it('should be able to return greetings in Greek and return a name', async function () {
            let greeted = greetings();

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
        it('it should return the count of people greeted', async function () {
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
        

            assert.deepEqual(rawNameArr, [
                
                { names: 'Freddy', counts: 1 },
                { names: 'Hlomla', counts: 1 },
                { names: 'Sam', counts: 1 }
              ]
              );

        });
        it('should be able to return the list of people greeted when one person is greeted twice', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Hlomla');
            await greeted.insertNames('Freddy');
            await greeted.insertNames('Freddy');

            let rawNameArr = await greeted.getNameList();
         
            assert.deepEqual(rawNameArr, [ { names: 'Freddy', counts: 2 }, { names: 'Hlomla', counts: 1 } ]
            );

        });
    })
    describe('Return how many times a user was greeted', function () {
        it('should be able to return the how counter when a person gets greeted more than twice', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Hlomla');
            await greeted.insertNames('Hlomla');
            await greeted.insertNames('Hlomla');

            assert.equal(await greeted.greetingsCounter('Hlomla'), 3)
        });
        it('should be able to return the how counter when a person gets greeted more than once', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Okuhle');
            await greeted.insertNames('Okuhle');

            assert.equal(await greeted.greetingsCounter('Okuhle'), 2)
        });
        it('should be able to return the how counter when a person gets greeted repeatedly', async function () {
            let greeted = greetings(pool);

            await greeted.insertNames('Xabiso');
            await greeted.insertNames('Xabiso');
            await greeted.insertNames('Xabiso');
            await greeted.insertNames('Xabiso');        
  
            assert.equal( await greeted.greetingsCounter('Xabiso'), 4)
        });
    });

    after(function () {
        pool.end();
    })
})




