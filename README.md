Rationale Behind Refactoring Decisions

Data Store Object: I made the data storeobject to store the book, author, genre data, variables into a single object to make it easier at manage in one place

Query Selectors Object: Collected all DOM element references into the selectors object. I did this to try and eliminate the chance of repetition of the code and functions.

By putting certain task into functions like renderOptions, renderBooks, updateShowMoreBook the code becomes more organised and it makes debugging easier

Event handlers, Organized all the event listeners in one place in the handleEvents function and to keep the code tidy and laso to make sure i do not have cases of repetiion of functions.

I was also carefull to ensure that the code has clear and consistent names.

Challenges
I had a big challenge when i had to go throught the code to try and understand what each part was doing the way it was organised in the begginning, then i had to find places where the code repeated itself and some functions were similar in their activities.

During the process of refactoring the code i had to keep track of the functionality of the code, I had to make sure that the new way that the code was organised still had the same functionality.

Reflections
In this challenge i was able to learn the importance of DOM manipulation
