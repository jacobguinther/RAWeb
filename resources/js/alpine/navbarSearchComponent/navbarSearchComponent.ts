import { fetcher } from '@/utils';

type SearchResult = {
  label: string,
  mylink: string,
}

type NavbarSearchComponentType = {
  showSearchResults:boolean,
  searchText:string,
  results: SearchResult[],
  selectedIndex:number,
  activeDecendentId: string,
  handleClickSearchResult: (label: string) => void,
  handleKeyDown: (e:KeyboardEvent) => void,
  handleKeyUp: (e:KeyboardEvent, el:HTMLInputElement) => void,
}

export function navbarSearchComponent(): NavbarSearchComponentType {
  return {
    showSearchResults: false,
    searchText: '',
    results: [],
    selectedIndex: -1,

    get activeDecendentId() {
      if (this.selectedIndex !== -1) {
        return this.results[this.selectedIndex - 2].mylink.slice(1).replace('/', '-');
      }
      return '';
    },

    handleClickSearchResult(label: string) {
      const input = document.querySelector<HTMLInputElement>('.searchboxinput');
      this.searchText = label;
      if (input) {
        input.value = label;
        this.showSearchResults = false;
        input.scrollLeft = input.scrollWidth * -1;
      }
    },

    handleKeyDown(e:KeyboardEvent) {
      if (e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
      }
    },

    async handleKeyUp(e:KeyboardEvent, el: HTMLInputElement) {
      if (e.key === 'ArrowLeft'
          || e.key === 'ArrowRight'
          || e.key === 'Shift'
          || e.key === 'Control'
          || e.key === 'Alt'
          || e.key === 'Meta'
      ) return;

      const {
        value
      } = el;

      if (value.length < 2) {
        this.showSearchResults = false;
        this.selectedIndex = -1;
        return;
      }
      const SearchBoxTopDropdown = document.querySelector('#search-listbox');
      const SearchBoxTopDropdownOptions = SearchBoxTopDropdown?.childNodes;
      if (SearchBoxTopDropdownOptions === undefined) return;

      switch (e.key) {
        case 'ArrowUp':
          if (this.showSearchResults) {
            if (this.selectedIndex === -1 || this.selectedIndex === 2) {
              this.selectedIndex = SearchBoxTopDropdownOptions.length - 2;
            } else {
              this.selectedIndex--;
            }
          }

          return;
        case 'ArrowDown':
          if (this.showSearchResults) {
            if (this.selectedIndex === -1 || this.selectedIndex === SearchBoxTopDropdownOptions.length - 2) {
              this.selectedIndex = 2;
            } else {
              this.selectedIndex++;
            }
          } else {
            this.showSearchResults = true;
          }
          return;
        case 'Enter':
          if (this.showSearchResults) {
            this.showSearchResults = false;

            if (this.selectedIndex !== -1) {
              this.searchText = this.results[this.selectedIndex - 2].label;
              window.location.href = this.results[this.selectedIndex - 2].mylink;
            }
          } else {
            document.querySelector<HTMLFormElement>('.searchbox-top')?.requestSubmit();
          }
          return;
        case 'Escape':
          if (this.showSearchResults) {
            this.showSearchResults = false;
          } else {
            this.searchText = '';
          }
          return;
        default:
      }

      this.selectedIndex = -1;

      const formData = new FormData();
      formData.append('term', this.searchText);

      const response = await fetcher<SearchResult[]>('/request/search.php', {
        method: 'POST',
        body: `term=${this.searchText}`,
      });

      this.results = response;
      this.showSearchResults = this.results.length > 0;
    }
  };
}
