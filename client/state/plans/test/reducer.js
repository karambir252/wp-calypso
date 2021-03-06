/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { useSandbox } from 'test/helpers/use-sinon';
import { getValidDataFromResponse } from '../actions';

// Reducers
import plansReducer, {
	items as itemsReducer,
	requesting as requestReducer,
	error as errorReducer
} from '../reducer';

/**
 * Actions creators functions
 */
import {
	plansReceiveAction,
	plansRequestAction,
	plansRequestSuccessAction,
	plansRequestFailureAction
} from '../actions';

/**
 * Fixture data
 */
import { WPCOM_RESPONSE } from './fixture';

describe( 'reducer', () => {
	let sandbox;

	useSandbox( newSandbox => {
		sandbox = newSandbox;
		// mute off console warn
		sandbox.stub( console, 'warn' );
	} );

	it( 'should export expected reducer keys', () => {
		expect( plansReducer( undefined, {} ) ).to.have.keys( [
			'items',
			'requesting',
			'error'
		] );
	} );

	describe( '#items()', () => {
		it( 'should default to an empty Array', () => {
			expect( itemsReducer( undefined, [] ) ).to.eql( [] );
		} );

		it( 'should index items state', () => {
			const initialState = undefined;
			const plans = getValidDataFromResponse( WPCOM_RESPONSE );
			const action = plansReceiveAction( plans );
			const newState = itemsReducer( initialState, action );
			const expectedState = plans;

			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should override plans', () => {
			const plans = getValidDataFromResponse( WPCOM_RESPONSE );
			const initialState = plans;
			const action = plansReceiveAction( plans );
			const expectedState = plans;
			const newState = itemsReducer( initialState, action );

			deepFreeze( initialState );
			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should persist state', () => {
			const plans = getValidDataFromResponse( WPCOM_RESPONSE );
			const initialState = plans;
			const action = { type: 'SERIALIZE' };
			const newState = itemsReducer( initialState, action );
			const expectedState = plans;

			deepFreeze( initialState );
			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should load persisted state', () => {
			const plans = getValidDataFromResponse( WPCOM_RESPONSE );
			const initialState = plans;
			const action = { type: 'DESERIALIZE' };
			const newState = itemsReducer( initialState, action );
			const expectedState = plans;

			deepFreeze( initialState );
			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should not load invalid persisted state', () => {
			// product_id should be `Number`
			const plans = [ { product_id: '234234' } ];
			const initialState = plans;
			const action = { type: 'DESERIALIZE' };
			const newState = itemsReducer( initialState, action );
			const expectedState = [];

			deepFreeze( initialState );
			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );
	} );

	describe( '#requesting()', () => {
		it( 'should return FALSE when initial state is undefined and action is unknown', () => {
			expect( requestReducer( undefined, {} ) ).to.eql( false );
		} );

		it( 'should return TRUE when initial state is undefined and action is REQUEST', () => {
			const initialState = undefined;
			const action = plansRequestAction();
			const expectedState = true;
			const newState = requestReducer( initialState, action );

			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should update `requesting` state on SUCCESS', () => {
			const initialState = true;
			const action = plansRequestSuccessAction();
			const expectedState = false;
			const newState = requestReducer( initialState, action );

			deepFreeze( initialState );
			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should update `requesting` state on FAILURE', () => {
			const initialState = true;
			const action = plansRequestFailureAction();
			const expectedState = false;
			const newState = requestReducer( initialState, action );

			deepFreeze( initialState );
			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );
	} );

	describe( '#errors()', () => {
		it( 'should return FALSE when initial state is undefined and action is unknown', () => {
			expect( errorReducer( undefined, {} ) ).to.eql( false );
		} );

		it( 'should set `error` state to TRUE on FAILURE', () => {
			const initialState = undefined;
			const action = plansRequestFailureAction();
			const expectedState = true;
			const newState = errorReducer( initialState, action );

			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should set `error` state to FALSE on REQUEST', () => {
			const initialState = true;
			const action = plansRequestAction();
			const expectedState = false;
			const newState = errorReducer( initialState, action );

			deepFreeze( initialState );
			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );

		it( 'should set `error` state to FALSE on SUCCESS', () => {
			const initialState = true;
			const action = plansRequestSuccessAction();
			const expectedState = false;
			const newState = errorReducer( initialState, action );

			deepFreeze( initialState );
			deepFreeze( action );

			expect( newState ).to.eql( expectedState );
		} );
	} );
} );
