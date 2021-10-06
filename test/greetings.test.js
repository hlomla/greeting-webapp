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
    ssl: useSSL
});

const greeted = new greetings(pool)

describe('Greetings', function () {
    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from usergreet;");

    });
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

            await greeted.getNameList(['Hlomla', 'Sam', 'Freddy']);

            assert.deepEqual( await greeted.getNameList(['Hlomla', 'Sam', 'Freddy']), await greeted.getNameList(['Hlomla', 'Sam', 'Freddy']))
        
        });
        it('should be able to return the list of people greeted when one person is greeted twice', async function () {
            let greeted = greetings(pool);
            
            await greeted.insertNames('Hlomla');
            await greeted.insertNames('Freddy');
            await greeted.insertNames('Freddy');

            await greeted.getNameList(['Hlomla', 'Freddy']);

            assert.deepEqual( await greeted.getNameList(['Hlomla', 'Freddy']), await greeted.getNameList(['Hlomla', 'Freddy']))
        
        });
    })
    after(function () {
        pool.end();
    })
})


// describe('Greeting Factory Function', function () {

//     describe('Return name value when person greeted in language selected', function () {
//         beforeEach(async function(){
//             // clean the tables before each test run
//             await pool.query("delete from usergreet;");

//         });
    //     it('should be able to return greetings in isiXhosa and return name', function () {
    //         let greeted = Greet();

    //         greeted.languageSelected('myName')

    //         assert.equal('Molo, Hlomla', greeted.languageSelected('isiXhosa', 'Hlomla'))

    //     });
    //     it('should be able to return greetings in English and return name', function () {
    //         let greeted = Greet();

    //         greeted.languageSelected('myName')

    //         assert.equal('Hello, Thandie', greeted.languageSelected('English', 'Thandie'))
    //     });
    //     it('should be able to return greetings in Greek and return name', function () {
    //         let greeted = Greet();
    //         greeted.languageSelected('myName')

    //         assert.equal('Geia, Freddy', greeted.languageSelected('Greek', 'Freddy'))
    //     });
    // });
    // describe('Return the count number of people greeted', function () {
    //     it('should be able to return the count number when one person greeted', function () {
    //         let greeted = Greet();

    //         greeted.setName('Freddy')
    //         greeted.languageSelected('Greek', 'Freddy')

    //         assert.equal(1, greeted.greetingsCounter())

    //     });
    //     it('should be able to return the count number when one person is greeted twice in a different language', function () {
    //         let greeted = Greet();

    //         greeted.setName('Fred')
    //         greeted.setName('Fred')

    //         greeted.languageSelected('Greek', 'Fred')
    //         greeted.languageSelected('isiXhosa', 'Fred')

    //         assert.equal(1, greeted.greetingsCounter())

    //     });
    //     it('should be able to return the count number when different people are greeted in a different languages', function () {
    //         let greeted = Greet();

    //         greeted.setName('Okuhle')
    //         greeted.setName('Sam')
    //         greeted.setName('Samantha')
    //         greeted.setName('Dean')

    //         greeted.languageSelected('Greek', 'Okuhle')
    //         greeted.languageSelected('isiXhosa', 'Sam')
    //         greeted.languageSelected('isiXhosa', 'Samantha')
    //         greeted.languageSelected('English', 'Dean')

    //         assert.equal(4, greeted.greetingsCounter())

    //     });
    //     describe('Return name list of people greeted', function () {
    //         it('should be able to return the list of people who were greeted', function () {
    //             let greeted = Greet();

    //             greeted.setName('Hlomla')
    //             greeted.setName('Sam')
    //             greeted.setName('Freddy')
    //             greeted.setName('Monica')

    //             greeted.getNameList(['Hlomla', 'Sam', 'Freddy', 'Monica'])

    //             assert.deepEqual(['Hlomla', 'Sam', 'Freddy', 'Monica'], greeted.getNameList(['Hlomla', 'Sam', 'Freddy', 'Monica']))

    //         });
    //         it('should be able to return the list of people who were greeted if one person was greeted twice', function () {
    //             let greeted = Greet();

    //             greeted.setName('Hlomla')
    //             greeted.setName('Hlomla')
    //             greeted.setName('Fred')
    //             greeted.setName('Sally')

    //             greeted.getNameList(['Hlomla', 'Fred', 'Monica'])

    //             assert.deepEqual(['Hlomla', 'Fred', 'Sally'], greeted.getNameList(['Hlomla', 'Fred', 'Sally']))

    //         });

    // it('should be able to return an error when language is not selected', function () {
    //     let greeted = Greet();

    //     assert.equal('Please select a language!',   greeted.errorMsg(null, "Okuhle" ))
    // });
    // it('should be able to return an error when name is not entered', function () {
    //     let greeted = Greet();
    //     greeted.errorMsg(null,' ')

    //     assert.equal('Please enter name!',   greeted.errorMsg(' '))
    // });
            // describe('Return errors', function () {
            //     it('should be able to return an error when language and name is not entered', function () {
            //         let greeted = Greet();
            //         greeted.errorMsg(null, ' ')


            //         assert.equal('Please enter name and select language!',   greeted.errorMsg(null, ' '))
            //     });

            // });
//         });
//     })
// })



