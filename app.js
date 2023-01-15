const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src= "${imgSrc}"/>
       ${movie.Title} (${movie.Year})
        `;
    },
    onOptionSelect(movie) {
        onMovieSelect(movie);
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '916718d2',
                s: searchTerm
            }
        });
        if (response.data.Error) {
            return [];
        }

        return response.data.Search;
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});


createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

//Get more detailed information when user clicks on a movie from the dropdown list
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '916718d2',
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

//Compare movie Stats to determine Winner
const runComparison = () => {
    let leftSideStats = document.querySelectorAll('#left-summary .notification');
    let rightSideStats = document.querySelectorAll('#right-summary .notification');


    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            console.log("RIGHT SIDE GREATER\nrightSideValue:", rightSideValue, "leftSideValue:", leftSideValue);
            console.log(Math.max(rightSideValue, leftSideValue));

            rightStat.classList.remove('is-primary', 'is-success');
            rightStat.classList.add('is-warning');

            leftStat.classList.remove('is-warning', 'is-success')
            leftStat.classList.add('is-primary');

        } else if (rightSideValue < leftSideValue) {
            console.log("LEFT SIDE GREATER\nrightSideValue:", rightSideValue, "leftSideValue:", leftSideValue);

            leftStat.classList.remove('is-primary', 'is-success');
            leftStat.classList.add('is-warning');

            rightStat.classList.remove('is-warning', 'is-success');
            rightStat.classList.add('is-primary');

        } else {
            console.log("EQUAL\nrightSideValue:", rightSideValue, "leftSideValue:", leftSideValue);
            rightStat.classList.remove('is-primary', 'is-warning');
            leftStat.classList.remove('is-primary', 'is-warning');

            rightStat.classList.add('is-success');
            leftStat.classList.add('is-success');
        }
        console.log(leftStat, rightStat);
    });
};

const movieTemplate = movieDetail => {
    console.log(movieDetail.Title)
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    console.log("BoxOffice:", dollars);

    const metaScore = parseInt(movieDetail.Metascore);
    console.log("MetaScore:", metaScore);

    const imdbRating = parseFloat(movieDetail.imdbRating);
    console.log("imdbRating:", imdbRating);

    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    console.log("imdbVotes:", imdbVotes);

    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);
    console.log("Awards:", awards);

    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};