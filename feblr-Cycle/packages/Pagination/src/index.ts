import xs, { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { Pagination } from 'feblr-view-model';
import intent from './intent';
import update from './update';
import view from './view';

export interface ISources {
  dom: DOMSource;
  props$: Stream<Pagination>;
}

export default function PaginationComp(sources: ISources): Stream<VNode> {
  let actions$ = intent(sources);
  let models$ = update({
    actions$: actions$,
    props$: sources.props$
  });

  return view(models$);
}
