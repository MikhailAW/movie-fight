const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {

    root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');


    //Recieve API data and populate dropdown list with content
    const onInput = async event => {
        const items = await fetchData(event.target.value);

        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');

        for (let item of items) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            //Allow user to click on result and update name in search bar
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item);
            });
            resultsWrapper.appendChild(option);
        }
    };

    //Capture input from search bar to make API call and use debounce function to limit API call frequency
    input.addEventListener('input', debounce(onInput, 500));

    //Close search dropdown list if user clicks anywhere else
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        };
    });

};