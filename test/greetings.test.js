describe('Greeting Factory Function', function () {

    describe('Return name value when person greeted in language selected', function () {
        it('should be able to return greetings in isiXhosa and return name', function () {
            let greeted = Greet();

            greeted.languageSelected('myName')

            assert.equal('Molo, Hlomla', greeted.languageSelected('isiXhosa', 'Hlomla'))

        });
        it('should be able to return greetings in English and return name', function () {
            let greeted = Greet();

            greeted.languageSelected('myName')

            assert.equal('Hello, Thandie', greeted.languageSelected('English', 'Thandie'))
        });
        it('should be able to return greetings in Greek and return name', function () {
            let greeted = Greet();
            greeted.languageSelected('myName')

            assert.equal('Geia, Freddy', greeted.languageSelected('Greek', 'Freddy'))
        });
    });
    describe('Return the count number of people greeted', function () {
        it('should be able to return the count number when one person greeted', function () {
            let greeted = Greet();

            greeted.setName('Freddy')
            greeted.languageSelected('Greek', 'Freddy')

            assert.equal(1, greeted.greetingsCounter())

        });
        it('should be able to return the count number when one person is greeted twice in a different language', function () {
            let greeted = Greet();

            greeted.setName('Fred')
            greeted.setName('Fred')

            greeted.languageSelected('Greek', 'Fred')
            greeted.languageSelected('isiXhosa', 'Fred')

            assert.equal(1, greeted.greetingsCounter())

        });
        it('should be able to return the count number when different people are greeted in a different languages', function () {
            let greeted = Greet();

            greeted.setName('Okuhle')
            greeted.setName('Sam')
            greeted.setName('Samantha')
            greeted.setName('Dean')

            greeted.languageSelected('Greek', 'Okuhle')
            greeted.languageSelected('isiXhosa', 'Sam')
            greeted.languageSelected('isiXhosa', 'Samantha')
            greeted.languageSelected('English', 'Dean')

            assert.equal(4, greeted.greetingsCounter())

        });
        describe('Return name list of people greeted', function () {
            it('should be able to return the list of people who were greeted', function () {
                let greeted = Greet();

                greeted.setName('Hlomla')
                greeted.setName('Sam')
                greeted.setName('Freddy')
                greeted.setName('Monica')

                greeted.getNameList(['Hlomla', 'Sam', 'Freddy', 'Monica'])

                assert.deepEqual(['Hlomla', 'Sam', 'Freddy', 'Monica'], greeted.getNameList(['Hlomla', 'Sam', 'Freddy', 'Monica']))

            });
            it('should be able to return the list of people who were greeted if one person was greeted twice', function () {
                let greeted = Greet();

                greeted.setName('Hlomla')
                greeted.setName('Hlomla')
                greeted.setName('Fred')
                greeted.setName('Sally')

                greeted.getNameList(['Hlomla', 'Fred', 'Monica'])

                assert.deepEqual(['Hlomla', 'Fred', 'Sally'], greeted.getNameList(['Hlomla', 'Fred', 'Sally']))

            });
            describe('Return errors', function () {
                it('should be able to return an error when language and name is not entered', function () {
                    let greeted = Greet();
                    greeted.errorMsg(null, ' ')


                    assert.equal('Please enter name and select language!',   greeted.errorMsg(null, ' '))
                });
                it('should be able to return an error when language is not selected', function () {
                    let greeted = Greet();

                    assert.equal('Please select a language!',   greeted.errorMsg(null, "Okuhle" ))
                });
                it('should be able to return an error when name is not entered', function () {
                    let greeted = Greet();
                    greeted.errorMsg(null,' ')

                    assert.equal('Please enter name!',   greeted.errorMsg(' '))
                });
            });
        });
    })
})