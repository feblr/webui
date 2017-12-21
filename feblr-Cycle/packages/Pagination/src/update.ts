import xs, { Stream } from 'xstream';
import { Pagination } from 'feblr-view-model';
import { Action } from './intent';

export interface ISources {
  actions$: Stream<Action>;
  props$: Stream<Pagination>
}

export default function update(sources: ISources): Stream<Pagination> {
  return xs.combine(sources.actions$, sources.props$)
    .map(([action, props]) => {
      switch (action.kind) {
        case 'PrevPage':
          props.gotoPrevPage();
        break;
        case 'NextPage':
          props.gotoNextPage();
        break;
        case 'GotoPage':
          props.gotoPage(action.page);
        break;
      }

      return props;
    });
}
