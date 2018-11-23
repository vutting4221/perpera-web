import { DateTime } from 'luxon';
import * as React from 'react';
import ObservableHelper from '../../helpers/Observable';
import './Search.css';

interface IState {
  searchText: string,
  networkType: string
}

class Search extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.searchTag = this.searchTag.bind(this);
    this.setSearchText = this.setSearchText.bind(this);

    this.state = {
      networkType: 'peercoin',
      searchText: ''
    }
  }

  public async searchTag(e: React.FormEvent) {
    e.preventDefault();

    const { searchText, networkType } = this.state;

    // tslint:disable-next-line:no-string-literal
    const perpera = window['perpera'];
    let doc = new perpera.Document(searchText, perpera.networks[networkType]);

    await doc.sync();
    doc = this.formatDate(doc);
    ObservableHelper.fire('onSearch', doc);
  }

  public formatDate(doc: any) {
    doc.transitions = doc.transitions.map((transition: any) => {
      return {
        ...transition,
        formattedTime: DateTime.fromISO(transition.state.time.toISOString()).toLocaleString(DateTime.DATETIME_MED)
      }
    });

    return doc;
  }

  public setSearchText(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;
    this.setState({ searchText: target.value });
  }


  public render() {
    return (
      <form className="SearchComp" onSubmit={this.searchTag}>
        <input type="text" className="search-field" placeholder="Search document tag" onInput={this.setSearchText} />
        <button className="search-btn">
          <img src="/img/icon-search.svg" alt="Search" width="24" />
        </button>
      </form>
    );
  }
}

export default Search;
