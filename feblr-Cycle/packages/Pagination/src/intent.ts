import xs, { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';

export interface PrevPage {
  kind: 'PrevPage';
}

export interface NextPage {
  kind: 'NextPage';
}

export interface GotoPage {
  kind: 'GotoPage';
  page: number;
}

export type Action = PrevPage | NextPage | GotoPage;

export interface ISources {
  dom: DOMSource;
}

export default function intent(sources: ISources): Stream<Action> {
  let prevPage$: Stream<PrevPage> = sources.dom.select('.prev button')
    .events('click')
    .map((evt: Event) => {
      return {kind: 'PrevPage'};
    });

  let nextPage$: Stream<NextPage> = sources.dom.select('.next button')
    .events('click')
    .map((evt: Event) => {
      return {kind: 'NextPage'};
    });

  let gotoPage$: Stream<GotoPage> = sources.dom.select('.page button')
    .events('click')
    .map((evt: Event) => {
      let target = evt.target as HTMLButtonElement;
      return { kind: 'GotoPage', number: parseInt(target.textContent) };
    });

  return xs.merge(prevPage$, nextPage$, gotoPage$);
}
