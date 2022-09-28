import React, { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        offset: 225,
        newItemLoading: false,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    // My version
    // onRequest = () => {
    //     this.marvelService
    //     .getAllCharacters(this.state.offset)
    //     .then(res => {
    //         res.forEach(item => {
    //             this.state.charList.push(item)
    //         });
    //         this.setState({
    //             offset: this.state.offset + 9,
    //         });
    //     })
    //     .catch(this.onError)
    // }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let end = false
        if (newCharList.length < 9) {
            end = true
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: end
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    charListRef = elem => {
        this.charListRef = elem;
    }

    activeChar = id => {
        this.charListRef = id
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems(arr) {
        const elements = arr.map((item, i) => {
            const {name, thumbnail, id} = item;
            let noImgStyle = {objectFit: 'cover'};
        
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                noImgStyle = {objectFit: 'unset'}
            }

            return (
                <li 
                    onClick={() => {
                        this.props.onCharSelected(id);
                        this.focusOnItem(i);
                    }} 
                    className="char__item" 
                    key={id}
                    tabIndex={0}
                    ref={this.setRef}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                    <img style={noImgStyle} src={thumbnail} alt={name}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return(
            <ul className="char__grid">
                {elements}
            </ul>
        )
    
    }

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state

        const elements = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null
        const spinner = loading ? <Spinner/> : null
        const content = !(loading || error) ? elements : null

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    onClick={() => this.onRequest(offset)} 
                    style={{'display': charEnded ? 'none' : 'block'}}
                    className="button button__main button__long"
                    disabled={newItemLoading}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )    
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList; 