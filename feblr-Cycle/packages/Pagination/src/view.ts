import xs, {Stream} from 'xstream';
import { VNode, div, button, ul, li } from '@cycle/dom';
import { Pagination } from 'feblr-view-model';

export default function view(model$: Stream<Pagination>) : Stream<VNode> {
  return model$.map(pagination => {
    return div('.pagination', [
      ul([
        li('.prev', [
          button({type: 'button'}, ['Prev'])
        ]),
        pagination.pages.map(page =>
          li('.page', [button([page.index + 1])])
        ),
        li('.next', [
          button({type: 'button'}, ['Next'])
        ])
      ])
    ])
  });
}
