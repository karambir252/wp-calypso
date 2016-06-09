/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import { createReducer } from 'state/utils';
/**
 * Internal dependencies
 */
import {
	PREFERENCES_SET,
	PREFERENCES_RECEIVE,
	PREFERENCES_FETCH,
	PREFERENCES_FETCH_SUCCESS,
	PREFERENCES_FETCH_FAILURE,
	SERIALIZE,
	DESERIALIZE
} from 'state/action-types';
import { USER_SETTING_KEY, DEFAULT_PREFERENCES } from './constants';

export function createReducerForPreferenceKey( key, defaultValue = null ) {
	const handlePreferencesFromApi = ( state, action ) => get( action, [ 'data', USER_SETTING_KEY, key ], state );
	return createReducer( defaultValue, {
		[ PREFERENCES_SET ]: ( state, action ) => ( action.key === key ) ? action.value : state,
		[ PREFERENCES_RECEIVE ]: handlePreferencesFromApi,
		[ PREFERENCES_FETCH_SUCCESS ]: handlePreferencesFromApi,
		[ SERIALIZE ]: state => state,
		[ DESERIALIZE ]: state => state,
	} );
}

const values = combineReducers( mapValues( DEFAULT_PREFERENCES,
	( value, key ) => createReducerForPreferenceKey( key, value )
) );
export const fetching = createReducer( false, {
	[ PREFERENCES_FETCH_SUCCESS ]: () => false,
	[ PREFERENCES_FETCH_FAILURE ]: () => false,
	[ PREFERENCES_FETCH ]: () => true,
} );

export default combineReducers( {
	values,
	fetching
} );