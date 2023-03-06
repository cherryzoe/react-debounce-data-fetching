import React, { useCallback, useEffect, useState } from 'react';

const CountriesList = () => {
  const [myList, setMyList] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const API_ENDPOINT =
    'https://algochurn-server.onrender.com/practice/countries';

  const debounce = (cb, delay) => {
    let timer;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  const handleTextChange = (text) => {
    setSearchText(text);
    text.length > 2 ? fetchData() : setOptions([]);
  };

  const search = useCallback(
    debounce((text) => handleTextChange(text), 500),
    []
  );

  const handleDeleteButtonOnClick = (removedItem) => {
    const updatedList = myList.filter((e) => e !== removedItem);
    setMyList(updatedList);
  };

  const fetchData = () => {
    fetch(`${API_ENDPOINT}/${searchText}`)
      .then((response) => response.json())
      .then((data) => {
        const { countries } = data;
        console.log(countries, data);
        setOptions(countries);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleSelectOption = (option) => {
    const updatedList = [...myList, option];
    setMyList(updatedList);
  };

  useEffect(() => {
    fetchData();
    return () => setOptions([]);
  }, [searchText]);

  return (
    <div>
      <input
        type="text"
        value={searchText}
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#f1f5f9',
          width: '400px',
        }}
        onChange={(e) => {
          handleTextChange(e.target.value);
        }}
      ></input>

      <div style={{ height: '100px', position: 'relative' }}>
        {options.length > 0 ? (
          <div
            style={{
              backgroundColor: '#f1f5f9',
              width: '200px',
              borderRadius: '5px',
              position: 'absolute',
              top: '10px',
              padding: '4px 4px',
            }}
          >
            {options.map((option) => (
              <div onClick={() => handleSelectOption(option)}>{option}</div>
            ))}
          </div>
        ) : null}{' '}
      </div>

      <div>
        {myList.map((item, idx) => (
          <div key={idx}>
            <label>{item}</label>
            <button onClick={() => handleDeleteButtonOnClick(item)}>x</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountriesList;
