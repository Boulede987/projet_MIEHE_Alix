

export class AddFavoritePollution {
  static readonly type = '[Fav] Add';
  constructor(public pollutionId: number) {}
}

export class RemoveFavoritePollution {
  static readonly type = '[Fav] Remove';
  constructor(public pollutionId: number) {}
}

export class ClearFavoritePollutions {
  static readonly type = '[Fav] Clear';
}