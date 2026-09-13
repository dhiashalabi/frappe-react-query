import { describe, expect, it } from 'vitest'

import * as core from '../src'
import * as extended from '../src/extended'
import * as realtime from '../src/realtime'

describe('entry graphs', () => {
    it('does not export realtime or extended hooks from the core entry', () => {
        expect(core).not.toHaveProperty('useFrappeDocLive')
        expect(core).not.toHaveProperty('useFrappeHasPermission')
        expect(core).not.toHaveProperty('useFrappeGetTimeZone')
        expect(core).toHaveProperty('useFrappeGetDoc')
        expect(core).toHaveProperty('frappeQueryKeys')
        expect(core).toHaveProperty('frappeQueryOptions')
        expect(realtime).toHaveProperty('useFrappeDocViewers')
        expect(realtime).toHaveProperty('useFrappeRealtimeEvent')
    })

    it('keeps extended and realtime as separate entries', () => {
        expect(extended).toHaveProperty('useFrappeHasPermission')
        expect(extended).toHaveProperty('frappeExtendedQueryOptions')
        expect(realtime).toHaveProperty('useFrappeDocLive')
        expect(realtime).toHaveProperty('useFrappeDocTypeLive')
        expect(realtime).toHaveProperty('useFrappeRealtime')
    })
})
